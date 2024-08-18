import prompt from './system.md';
import { TOOLS } from '../../vars';

export const splitFunctionCall = (input: string): { functionName: string; functionArguments: Record<string, any> } | null => {
  const regExp = /(\w+)\((.*)\)/;
  const matches = input.match(regExp);

  if (!matches) {
    return null;
  }

  const [, functionName, argsString] = matches;

  let functionArguments: Record<string, any>;
  try {
    functionArguments = JSON.parse(argsString);
  } catch (error) {
    throw error
  }

  return {
    functionName,
    functionArguments
  };
}

export const getSystemPrompt = () => {
  const functionString = TOOLS.map(fn => JSON.stringify(fn, null, 2)).join('\n')
  return prompt
    .replace('{{today_date}}', new Date().toDateString())
    .replace('{{tools_instructions}}', [
      '- When looking for real time information use relevant functions if available',
      'You have access to the following functions:',
      functionString,
    ].join('\n\n'))
}

type WithoutTypename<T> = T extends { __typename: string }
  ? Omit<T, '__typename'>
  : T extends (infer U)[]
  ? WithoutTypename<U>[]
  : T extends object
  ? { [K in keyof T]: WithoutTypename<T[K]> }
  : T;

export function removeTypename<T>(obj: T): WithoutTypename<T> {
  if (Array.isArray(obj)) {
    return obj.map(removeTypename) as WithoutTypename<T>;
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (key !== '__typename') {
        newObj[key] = removeTypename(obj[key]);
      }
    }
    return newObj;
  }
  return obj as WithoutTypename<T>;
}
