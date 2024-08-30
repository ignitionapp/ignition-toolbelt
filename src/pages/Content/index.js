import React from 'react';
import { createRoot } from 'react-dom/client';
import 'arrive';

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

import { q } from './lib';
import { AiButtonApp } from './ai-button-app';
import { AiAssistantApp } from './ai-assistant-app';

window.addEventListener('load', async () => {
  setComicSans();
  setMissionControlRedirect();
  setNpeExit();
  await setGithubTicketAutolink();
  setJiraMissionControlLogin();
  await setSignupAutofill();
  setSubscriptionAutofill();
  setPaymentSetupAutofill();
  setStripeConnectAutofill();
  await setGithubAutofill();
  setLocalAIAssistant();
});

chrome.runtime.onMessage.addListener(async ({ type }) => {
  let rootEl = document.getElementById('ignition-toolbelt-app');
  if (rootEl === null && type === 'set-bubble-activation') {
    rootEl = document.createElement('div');
    rootEl.id = 'ignition-toolbelt-app';

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');

    if (!document.body || !csrfToken) {
      return;
    }

    document.body.appendChild(rootEl);
    const root = createRoot(rootEl);
    root.render(<App csrfToken={csrfToken} />);

    document.arrive('[data-testid="top-new-action-menu"]', () => {
      const topNewActionButtonEl = q('[data-testid="top-new-action-menu"]');
      const buttonEl = document.createElement('div');
      buttonEl.id = 'ignition-toolbelt-assistant-button';
      topNewActionButtonEl.parentNode.appendChild(buttonEl);
      const topButtonRoot = createRoot(buttonEl);
      topButtonRoot.render(<AiButtonApp csrfToken={csrfToken} />);
    });

    document.arrive('.app-container', () => {
      const appContainerEl = q('.app-container');
      const sidebarEl = document.createElement('div');
      sidebarEl.id = 'ignition-boolbelt-assistant-sidebar';
      sidebarEl.style.transition = 'width 0.5s';
      appContainerEl.parentNode.appendChild(sidebarEl);
      const sidebarRoot = createRoot(sidebarEl);
      sidebarRoot.render(
        <AiAssistantApp
          csrfToken={csrfToken}
          onOpen={() => (sidebarEl.style.width = '33%')}
          onClose={() => (sidebarEl.style.width = '0')}
        />
      );
    });
  }
});
