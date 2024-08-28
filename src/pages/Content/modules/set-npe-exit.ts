import debounce from 'debounce';
import 'arrive'

import { NPE_EXIT, q, waitForElement } from '../lib';

const removeButton = () => {
  const closeButtonEl = q<HTMLLinkElement>('#npe-exit-button');
  if (closeButtonEl) {
    closeButtonEl.parentNode?.removeChild(closeButtonEl)
  }
}

const appendButton = async () => {
  let closeButtonEl = q<HTMLLinkElement>('#npe-exit-button');
  if (closeButtonEl) {
    return
  }

  closeButtonEl = document.createElement('a') as unknown as HTMLLinkElement;
  closeButtonEl.id = 'npe-exit-button';
  closeButtonEl.href = '/dashboard';
  closeButtonEl.innerHTML = '⨯';
  closeButtonEl.title = 'Close the NPE';
  closeButtonEl.className = 'npe-exit-button';

  const proposalHeaderEl = await waitForElement<HTMLDivElement>(
    '[data-testid="proposal-header"]'
  );
  if (proposalHeaderEl?.firstChild) {
    (proposalHeaderEl.firstChild as HTMLElement).prepend(closeButtonEl);
  }
}

const run = async (isEnabled: boolean) => {
  if (isEnabled) {
    appendButton()
  } else {
    removeButton()
  }
}

export const setNpeExit = () => {
  chrome.runtime.onMessage.addListener(async ({ type }) => {
    if (type !== NPE_EXIT) {
      return
    }

    const result = await chrome.storage.local.get([NPE_EXIT]);
    const isEnabled = !!result[NPE_EXIT];
    await run(isEnabled)
  });

  chrome.storage.local.onChanged.addListener(async (changes) => {
    if (!changes[NPE_EXIT]) {
      return
    }

    const isEnabled = !!changes[NPE_EXIT].newValue
    await run(isEnabled)
  });
};
