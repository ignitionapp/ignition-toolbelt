import { ChatCompletionTool, InitProgressReport } from '@mlc-ai/web-llm';

type Role = 'system' | 'user' | 'tool' | 'function' | 'assistant';

export type Message = {
  role: Role;
  content: string;
  name?: string;
  tool_call_id?: string;
};

export type HistoryItem = {
  sender: Role;
  name?: string;
  message: string | null;
  tool_call_id?: string;
};

export type OnInitializing = (progressReport: InitProgressReport) => void;

export type AskLocalAssistantArgs = {
  messageRole: Role;
  messageContent: string;
  messageName?: string;
  history: HistoryItem[];
  isFunctionCall?: boolean;
  tools?: ChatCompletionTool[];
  onDownloading(progress: number, totalMegaBytes: number): void;
  onDownloadPreparing(): void;
  onLoading(progress: number): void;
  onInit: () => void;
  onUpdate: (assistantMessage: string) => void;
  onCallFunction: (
    functionName: string,
    parameters: Record<string, unknown>
  ) => Promise<any>;
};
