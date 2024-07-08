import { API_ENDPOINT, INVOICE_FUNCITON } from './vars';

const tools = [INVOICE_FUNCITON];

const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

type Args = {
  messageRole?: 'user' | 'assistant' | 'function';
  messageContent: string;
  messageName?: string;
  token: string;
  history: {
    sender: string;
    message: string;
  }[];
  isFunctionCall?: boolean;
  onInit: () => void;
  onUpdate: (assistantMessage: string) => void;
  onCallFunction: (
    functionName: string,
    parameters: { [key: string]: string }
  ) => Promise<any>;
};

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
}: Args) => {
  try {
    const messages = [
      ...(history.length === 0
        ? [
            {
              role: 'system',
              content:
                'Your name is Sparky, a helpful assistant who can help users of Ignition, an accounting SaaS app, to answer their questions and queries.',
            },
          ]
        : []),
      ...history.map((h) => ({ role: h.sender, content: h.message })),
      {
        role: messageRole,
        name: messageName,
        content: messageContent,
      },
    ];

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-1106-preview',
        messages,
        tools: isFunctionCall ? tools : undefined,
        tool_choice: isFunctionCall ? 'auto' : undefined,
        temperature: 0,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    onInit();

    let assistantMessage = '';
    let functionArguments = '';
    let functionName = '';
    while (true) {
      const { done, value } = (await reader?.read()) || {};
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk
        .toString()
        .split('\n')
        .filter((line) => line.trim() !== '');

      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          break;
        }
        try {
          const parsed = JSON.parse(message);
          const currentMessage = parsed.choices[0].delta.content;
          const toolCalls = parsed.choices[0].delta.tool_calls;
          if (currentMessage) {
            assistantMessage += currentMessage;
          } else if (toolCalls) {
            const toolCall = toolCalls[0].function;
            if (toolCall.name) {
              functionName = toolCall.name;
            }
            if (toolCall.arguments) {
              functionArguments += toolCall.arguments;
            }
          }
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }

      if (
        messageRole !== 'function' &&
        functionName &&
        isValidJSON(functionArguments)
      ) {
        onUpdate('Yes, I can help with that. One moment...');

        const parameters = JSON.parse(functionArguments);
        const functionResult = await onCallFunction(functionName, parameters);

        await askAssistant({
          messageRole: 'function',
          messageName: functionName,
          messageContent: JSON.stringify(functionResult),
          token,
          history: messages.map(({ role, content }) => ({
            sender: role,
            message: content,
          })),
          isFunctionCall: false,
          onInit,
          onUpdate,
          onCallFunction,
        });

        functionName = '';
        functionArguments = '';
        return;
      }

      onUpdate(assistantMessage);
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to call OpenAI API');
  }
};
