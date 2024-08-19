import 'arrive';

import OpenAI from 'openai';

import prompt from './prompt.md';

import {
  GITHUB_AUTOFILL,
  GITHUB_AUTOFILL_SETTING,
  AI_ASSISTANT,
  q,
  simulateClick,
  simulateType,
  waitForElement,
} from '../../lib';

import { fetchCompare } from './utils';

const run = async (url?: string) => {
  const results = await chrome.storage.local.get([GITHUB_AUTOFILL_SETTING, AI_ASSISTANT]);
  const { reviewers, labels, token } = results[GITHUB_AUTOFILL_SETTING] || {
    reviewers: [],
    labels: [],
    token: '',
  };
  const { token: assistantToken } = results[AI_ASSISTANT] || {};

  //====================
  // Autofill reviewers
  //====================
  if (reviewers.length) {
    console.log('[DEBUG] reviewers', reviewers)
    const reviewerEl = await waitForElement<HTMLDivElement>(
      '[data-menu-trigger="reviewers-select-menu"]'
    );
    if (reviewerEl) {
      simulateClick(reviewerEl);
      const reviewerInput = q<HTMLInputElement>('#review-filter-field');
      if (reviewerInput) {
        for (const reviewer of reviewers) {
          simulateType(reviewerInput, reviewer);
          const el = await waitForElement<HTMLSpanElement>(
            `.js-username:contains("${reviewer}")`
          );
          if (el) {
            simulateClick(el);
            simulateType(reviewerInput, '{selectall}{del}');
          }
        }
        simulateType(reviewerInput, '{esc}');
        simulateClick(reviewerEl);
      }
    }
  }

  //====================
  // Autofill labels
  //====================
  if (labels.length) {
    console.log('[DEBUG] labels', labels)
    const labelEl = q('[data-menu-trigger="labels-select-menu"]');
    if (labelEl) {
      simulateClick(labelEl);
      const labelInput = q<HTMLInputElement>('#label-filter-field');
      if (labelInput) {
        for (const label of labels) {
          simulateType(labelInput, label);
          const el = await waitForElement<HTMLSpanElement>(
            `.js-label-name-html:contains("${label}")`
          );
          if (el) {
            simulateClick(el);
            simulateType(labelInput, '{selectall}{del}');
          }
        }
        simulateType(labelInput, '{esc}');
        simulateClick(labelEl);
      }
    }
  }

  //======================
  // Autofill description
  //======================

  if (token && url) {
    const { content = '', commits = [] } = await fetchCompare(url, token);
    const lastCommit = commits[commits.length - 1].commit;

    const title = lastCommit.message.split('\n')[0];
    const titleEl = q<HTMLInputElement>('#pull_request_title');
    const bodyEl = q<HTMLTextAreaElement>('#pull_request_body');

    if (titleEl) {
      titleEl.value = title;
    }

    if (bodyEl) {
      bodyEl.value = `## What
\n${title}\n
## Why
\n\n
## How
\n${lastCommit?.message.split('\n\n')[1] || ''}\n
## Before
\n\n
## After
\n\n`;
    }

    if (assistantToken) {

      const openai = new OpenAI({
        apiKey: assistantToken,
        dangerouslyAllowBrowser: true,
      });

      const stream = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content },
        ],
        temperature: 0,
        stream: true,
      });

      if (bodyEl) {
        bodyEl.value = '';
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          bodyEl.value += content;
          bodyEl.scrollTop = bodyEl.scrollHeight;
        }
      }
    }
  }
}

export const setGithubAutofill = async () => {
  chrome.runtime.onMessage.addListener(async ({ type, value }) => {
    if (type !== GITHUB_AUTOFILL) {
      return;
    }

    if (q('body.is-pr-composer-expanded')) {
      await run(value);
      return;
    }

    // @ts-ignore
    document.arrive(
      'body.is-pr-composer-expanded',
      { fireOnAttributesModification: true },
      async () => {
        await run(value);
      }
    );
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    const featureFlags = Object.keys(changes);
    if (featureFlags.includes(GITHUB_AUTOFILL)) {
      await run();
    }
  });
};
