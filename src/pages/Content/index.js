import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import { setComicSans } from './modules/set-comics-sans';
import { setMissionControlRedirect } from './modules/set-mission-control-redirect';
import { setNpeExit } from './modules/set-npe-exit';
import { setGithubTicketAutolink } from './modules/set-github-ticket-autolink';
import { setJiraMissionControlLogin } from './modules/set-jira-mission-control-login';
import { setPaymentSetupAutofill } from './modules/set-payment-setup-autofill';
import { setSignupAutofill } from './modules/set-signup-autofill';
import { setStripeConnectAutofill } from './modules/set-stripe-connect-autofill';
import { setSubscriptionAutofill } from './modules/set-subscription-autofill';
import { setGithubAutofill } from './modules/set-github-autofill';
import { setLocalAIAssistant } from './modules/set-local-ai-assistant';

window.addEventListener('load', async () => {
  await setComicSans();
  await setMissionControlRedirect();
  await setNpeExit();
  await setGithubTicketAutolink();
  await setJiraMissionControlLogin();
  await setSignupAutofill();
  await setSubscriptionAutofill();
  await setPaymentSetupAutofill();
  await setStripeConnectAutofill();
  await setGithubAutofill();
  await setLocalAIAssistant();
});

chrome.runtime.onMessage.addListener(async ({ type }) => {
  let rootEl = document.getElementById('ignition-toolbelt-app');
  if (rootEl === null && type === 'set-bubble-activation') {
    rootEl = document.createElement('div');
    rootEl.id = 'ignition-toolbelt-app';

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');

    if (document.body && csrfToken) {
      document.body.appendChild(rootEl);
      const root = createRoot(rootEl);
      root.render(<App csrfToken={csrfToken} />);
    }
  }
});
