import { CreateExtensionServiceWorkerMLCEngine } from '@mlc-ai/web-llm';
import type { ChatCompletionChunk, MLCEngineInterface } from '@mlc-ai/web-llm';

import prompt from '../../system.md';
import { TOOLS } from '../../vars';
import { AskLocalAssistantArgs, Message, OnInitializing } from './types';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

const MODEL_ID = 'Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC';

let engine: MLCEngineInterface | null = null;

const init = async (onInitializing: OnInitializing) => {
  if (engine) {
    return engine;
  }

  engine = await CreateExtensionServiceWorkerMLCEngine(MODEL_ID, {
    initProgressCallback: onInitializing,
  });

  return engine;
};

export const askLocalAssistant = async ({
  messageRole,
  messageName,
  messageContent,
  isFunctionCall = true,
  history,
  onInit,
  onLoading,
  onDownloading,
  onUpdate,
  onCallFunction,
}: AskLocalAssistantArgs): Promise<void> => {
  try {
    if (!engine) {
      await init((report) => {
        if (report.progress >= 1) {
          return;
        }

        if (report.text.includes('Loading model from cache')) {
          const match = report.text.match(
            /Loading model from cache\[(\d+)\/(\d+)\]/
          );
          if (match) {
            const [, current, total] = match.map(Number);
            const progressPercentage = Math.floor((current / total) * 100);
            const clampedProgress = Math.min(
              Math.max(progressPercentage, 1),
              100
            );
            onLoading(clampedProgress);
          }
          return;
        }

        if (report.text.includes('Start to fetch params')) {
          onDownloading(0, 0);
        }

        if (report.text.includes('Fetching param cache')) {
          const [, totalMegaBytes] = report.text.match(/(\d+)MB fetched/) || [];
          const progressPercentage = Math.floor(report.progress * 100);
          const clampedProgress = Math.min(
            Math.max(progressPercentage, 1),
            100
          );
          onDownloading(clampedProgress, parseInt(totalMegaBytes));
        }
      });
    }

    const messages: Message[] = [
      {
        role: 'user',
        content: `${prompt}\n\n Today is ${new Date().toDateString()}`,
      },
      ...history.map(({ sender, message, name, tool_call_id }) => ({
        role: sender,
        name,
        content: message as string,
        tool_call_id,
      })),
      {
        role: messageRole,
        ...(messageName && { name: messageName }),
        content: messageContent,
      },
    ];

    if (!engine) {
      return;
    }

    onInit();

    let assistantMessage = '';
    const asyncChunkGenerator = await engine.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      tools: isFunctionCall ? TOOLS : undefined,
      tool_choice: isFunctionCall ? 'auto' : undefined,
      stream: true,
      stream_options: {
        include_usage: true,
      },
      temperature: 0,
    });

    let lastChunk: ChatCompletionChunk | undefined;
    let usageChunk: ChatCompletionChunk | undefined;

    for await (const chunk of asyncChunkGenerator) {
      assistantMessage += chunk.choices[0]?.delta?.content || '';
      onUpdate(assistantMessage);
      if (!chunk.usage) {
        lastChunk = chunk;
      }
      usageChunk = chunk;
    }

    // TODO
    // console.log('[DEBUG] usageChunk.usage', usageChunk?.usage);

    const toolCalls = lastChunk!.choices[0].delta.tool_calls || [];
    if (toolCalls.length) {
      const functionName = toolCalls[0].function?.name;
      const functionArguments = toolCalls[0].function?.arguments
        ? JSON.parse(toolCalls[0].function?.arguments)
        : undefined;

      if (!functionName || !functionArguments) {
        return;
      }

      onUpdate('Yes, I can help with that. One moment...');

      console.info(
        `[DEBUG] Function calling: ${functionName}(${JSON.stringify(
          functionArguments
        )})`
      );

      const functionResult = await onCallFunction(
        functionName,
        functionArguments
      );

      return askLocalAssistant({
        messageRole: 'user',
        messageName: functionName,
        messageContent: JSON.stringify(functionResult),
        history: messages.map(({ role, name, content }) => ({
          sender: role,
          name,
          message: content,
        })),
        isFunctionCall: false,
        onInit,
        onLoading,
        onDownloading,
        onUpdate,
        onCallFunction,
      });
    }
  } catch (error) {
    console.error('[DEBUG] Error using MLC Engine:', error);
    throw new Error('Failed to use MLC Engine');
  }
};
