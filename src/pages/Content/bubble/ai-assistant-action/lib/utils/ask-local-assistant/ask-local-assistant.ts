import { CreateExtensionServiceWorkerMLCEngine } from '@mlc-ai/web-llm';
import type { ChatCompletionChunk, MLCEngineInterface } from '@mlc-ai/web-llm';

import { AskLocalAssistantArgs, Message, OnInitializing } from './types';
import { splitFunctionCall, getSystemPrompt, removeTypename } from './utils';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { Role } from '../../types';

const MODEL_ID = 'Llama-3.1-8B-Instruct-q4f16_1-MLC';

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
  history,
  onInit,
  onLoading,
  onDownloading,
  onDownloadPreparing,
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

    const prompt = getSystemPrompt();
    const messages: Message[] = [
      {
        role: 'system',
        content: prompt
      },
      ...history.map(({ sender, message, name, tool_call_id }) => ({
        role: sender,
        ...(name && { name }),
        content: message as string,
        ...(tool_call_id && { tool_call_id }),
      })),
      {
        role: messageRole,
        content: messageContent,
        ...(messageName && { name: messageName }),
        ...(messageRole === 'tool' && { tool_call_id: '0' }),
      },
    ];

    if (!engine) {
      return;
    }

    onInit();

    let assistantMessage = '';
    const asyncChunkGenerator = await engine.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      stream: true,
      stream_options: {
        include_usage: true,
      },
      temperature: 0,
    });

    // let lastChunk: ChatCompletionChunk | undefined;
    // let usageChunk: ChatCompletionChunk | undefined;

    for await (const chunk of asyncChunkGenerator) {
      assistantMessage += chunk.choices[0]?.delta?.content || '';
      onUpdate(assistantMessage);
      // if (!chunk.usage) {
      //   lastChunk = chunk;
      // }
      // usageChunk = chunk;
      // TODO
    }

    const result = splitFunctionCall(assistantMessage);
    if (result) {
      const { functionName, functionArguments } = result;
      if (!functionName || !functionArguments) {
        return;
      }

      onUpdate('Yes, I can help with that. One moment...');

      console.info(
        `[DEBUG] Function calling: ${functionName}(${JSON.stringify(
          functionArguments
        )
        })`
      );

      const functionResult = await onCallFunction(
        functionName,
        functionArguments
      );

      const updatedHistory = [
        ...messages.slice(1).map(({ role, name, content }) => ({
          sender: role,
          name,
          message: content,
        })),
        {
          sender: 'assistant' as Role,
          name: 'function_call',
          message: `${functionName}(${JSON.stringify(functionArguments)})`
        }
      ];

      return askLocalAssistant({
        messageRole: 'tool',
        messageContent: JSON.stringify(removeTypename(functionResult)),
        history: updatedHistory,
        onInit,
        onLoading,
        onDownloading,
        onDownloadPreparing,
        onUpdate,
        onCallFunction,
      });
    }
  } catch (error) {
    console.error('[DEBUG] Error using MLC Engine:', error);
    throw new Error('Failed to use MLC Engine');
  }
};
