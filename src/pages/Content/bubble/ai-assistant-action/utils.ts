import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

import prompt from './system.md';
import { HistoryItem, Role, Tool, Message } from './types';
import { TOOLS } from './vars';

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

type Args = {
  messageRole?: Role;
  messageContent: string | null;
  messageName?: string;
  token: string;
  history: HistoryItem[];
  isFunctionCall?: boolean;
  tools?: Tool[];
  onInit: () => void;
  onUpdate: (assistantMessage: string) => void;
  onCallFunction: (
    functionName: string,
    parameters: Record<string, unknown>
  ) => Promise<any>;
};

let openai: OpenAI | null = null;

export const askAssistant = async ({
  messageRole = 'user',
  messageName,
  messageContent,
  isFunctionCall = true,
  token,
  history,
  onInit,
  onUpdate,
  onCallFunction,
}: Args): Promise<
  | void
  | (OpenAI.Chat.Completions.ChatCompletion &
      Stream<OpenAI.Chat.Completions.ChatCompletionChunk>)
> => {
  try {
    const previousMessages: Message[] = history.map((h) => ({
      role: h.sender,
      content: h.message,
      ...(h.name && { name: h.name }),
    }));

    const today = new Date();
    const messages: Message[] = [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'system',
        content: `Today is ${today.toDateString()}`,
      },
      ...previousMessages,
      {
        role: messageRole,
        ...(messageName && { name: messageName }),
        content: messageContent,
      },
    ];

    if (!openai) {
      openai = new OpenAI({
        apiKey: token,
        dangerouslyAllowBrowser: true,
      });
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      tools: isFunctionCall ? TOOLS : undefined,
      tool_choice: isFunctionCall ? 'auto' : undefined,
      temperature: 0,
      stream: true,
    });

    onInit();

    let assistantMessage = '';
    let functionName = '';
    let functionArguments = '';

    for await (const chunk of stream) {
      if (chunk.choices[0].delta.content) {
        assistantMessage += chunk.choices[0].delta.content;
        onUpdate(assistantMessage);
      }

      if (chunk.choices[0].delta.tool_calls) {
        const toolCall = chunk.choices[0].delta.tool_calls[0].function;
        if (toolCall?.name) {
          functionName = toolCall.name;
        }
        if (toolCall?.arguments) {
          functionArguments += toolCall.arguments;
        }
      }
    }

    if (
      messageRole !== 'function' &&
      functionName &&
      isValidJSON(functionArguments)
    ) {
      onUpdate('Yes, I can help with that. One moment...');
      const parameters = JSON.parse(functionArguments);

      console.info(
        `[DEBUG] Function calling: ${functionName}(${JSON.stringify(
          parameters
        )})`
      );

      const functionResult = await onCallFunction(functionName, parameters);

      return askAssistant({
        messageRole: 'function',
        messageName: functionName,
        messageContent: JSON.stringify(functionResult),
        token,
        history: messages.map(({ role, name, content }) => ({
          sender: role,
          name,
          message: content,
        })),
        isFunctionCall: false,
        onInit,
        onUpdate,
        onCallFunction,
      });
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to call OpenAI API');
  }
};
