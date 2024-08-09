import { OpenAI } from 'openai';

export type Role = OpenAI.ChatCompletionMessageParam['role'];
export type Tool = OpenAI.ChatCompletionTool;

export type Message = {
  role: Role;
  name?: string;
  content: string | null;
};

export type HistoryItem = {
  sender: Role;
  name?: string;
  message: string | null;
  tool_call_id?: string;
};
