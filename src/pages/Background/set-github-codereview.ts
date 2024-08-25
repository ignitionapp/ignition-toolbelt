import debounce from 'debounce';

import { GITHUB_CODE_REVIEW } from '../Content/lib';

(async () => {
  const filters = {
    url: [
      {
        hostEquals: 'github.com',
        pathPrefix: '/ignitionapp/Practice-Ignition/pull/',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: GITHUB_CODE_REVIEW,
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
