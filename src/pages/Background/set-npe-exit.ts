import debounce from 'debounce';
import { NPE_EXIT } from '../Content/lib';

(() => {
  const filters = {
    url: [
      {
        hostSuffix: 'ignitionapp.com',
        pathContains: 'proposal-editor/prop_',
      },
      {
        hostContains: 'localhost',
        pathContains: 'proposal-editor/prop_',
      },
    ],
  };

  const handleLoadPage = async ({ tabId, url }: { tabId: number; url: string }) => {
    const result = await chrome.storage.local.get([NPE_EXIT]);
    const isEnabled = !!result[NPE_EXIT];
    if (isEnabled) {
      chrome.tabs.sendMessage(tabId, {
        type: NPE_EXIT,
        value: url,
      });
    }
  };

  const handleLoadPageDebounced = debounce(handleLoadPage, 500);

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPageDebounced,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPageDebounced, filters);
})();
