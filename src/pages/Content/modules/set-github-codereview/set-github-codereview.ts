import 'arrive';

import OpenAI from 'openai';

import prompt from './prompt.md';

import {
  AI_ASSISTANT,
  // GITHUB_AUTOFILL,
  GITHUB_AUTOFILL_SETTING,
  GITHUB_CODE_REVIEW,
  q,
} from '../../lib';

import { fetchGithubData } from './utils';

const run = async (url?: string) => {
  console.log('[DEBUG] Running code review....');
  const results = await chrome.storage.local.get([GITHUB_AUTOFILL_SETTING, AI_ASSISTANT]);
  const { token: githubToken } = results[GITHUB_AUTOFILL_SETTING] || {};
  const { token: openAiToken } = results[AI_ASSISTANT] || {};

  //======================
  // Autofill description
  //======================
  if (githubToken && githubToken && url) {
    await fetchGithubData(url, githubToken);
    // const lastCommit = commits[commits.length - 1].commit;

    // if (openAiToken) {

    //   const openai = new OpenAI({
    //     apiKey: openAiToken,
    //     dangerouslyAllowBrowser: true,
    //   });

    //   const stream = await openai.chat.completions.create({
    //     model: 'gpt-4o-mini-2024-07-18',
    //     messages: [
    //       { role: 'system', content: prompt },
    //       { role: 'user', content },
    //     ],
    //     seed: 1,
    //     temperature: 0,
    //     stream: true,
    //   });

    //   if (bodyEl) {
    //     bodyEl.value = '';
    //     for await (const chunk of stream) {
    //       const content = chunk.choices[0]?.delta?.content || '';
    //       bodyEl.value += content;
    //       bodyEl.scrollTop = bodyEl.scrollHeight;
    //     }
    //   }

    //   console.log('[DEBUG] Reviewing your code...');
    //   const codeReviewResponse = await openai.chat.completions.create({
    //     model: 'gpt-4o',
    //     messages: [
    //       { role: 'system', content: codeReviewPrompt },
    //       { role: 'user', content },
    //     ],
    //     temperature: 0,
    //     seed: 2,
    //   });

    //   const codeReviewOutput = codeReviewResponse.choices[0]?.message?.content || '';
    //   console.log('[DEBUG] Code Review Output:\n', codeReviewOutput);
  }
}


export const setGithubCodeReview = async () => {
  chrome.runtime.onMessage.addListener(async ({ type, value }) => {
    console.log('[DEBUG] Running code review!!!!');
    if (type !== GITHUB_CODE_REVIEW) {
      return;
    }

    await run(value);
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(GITHUB_CODE_REVIEW)) {
      await run();
    }
  });
};
