import debounce from 'debounce';

const FILTERS = {
  url: [
    {
      hostEquals: 'localhost',
      ports: [3000],
    },
    {
      hostSuffix: '.ignitionapp.com',
    },
  ],
};

const handleLoadPage = async ({
  tabId,
  url,
}: {
  tabId: number;
  url: string;
}) => {
  const excludedPathRegex = /\/(console|graphiql|client-portal|dist)/;
  const urlScheme = new URL(url);
  if (!excludedPathRegex.test(urlScheme.pathname)) {
    chrome.tabs.sendMessage(tabId, { type: 'set-bubble-activation' });
  }
};

const handleLoadPageDebounced = debounce(handleLoadPage, 500);

chrome.webNavigation.onHistoryStateUpdated.addListener(
  handleLoadPageDebounced,
  FILTERS
);

chrome.webNavigation.onCompleted.addListener(handleLoadPageDebounced, FILTERS);
