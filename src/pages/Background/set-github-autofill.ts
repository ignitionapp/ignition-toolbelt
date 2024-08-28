import debounce from 'debounce';

import { GITHUB_AUTOFILL } from '../Content/lib';

(async () => {
  const filters = {
    url: [
      {
        hostEquals: 'github.com',
        pathPrefix: '/ignitionapp/Practice-Ignition/compare/',
      },
      {
        hostEquals: 'github.com',
        pathPrefix: '/ignitionapp/ignition-toolbelt/compare/',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: GITHUB_AUTOFILL,
      value: url,
    });
  };

  const handleLoadPageDebounced = debounce(handleLoadPage, 1000);

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPageDebounced,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(
    handleLoadPageDebounced,
    filters
  );
})();
