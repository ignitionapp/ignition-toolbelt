(() => {
  const filters = {
    url: [
      {
        hostEquals: 'ignitionapp.atlassian.net',
        pathContains: '/browse/',
      },
      {
        hostEquals: 'ignitionapp.atlassian.net',
        pathContains: '/jira/servicedesk',
      },
    ],
  };

  const handleLoadPage = ({ tabId, url }: { tabId: number; url: string }) => {
    chrome.tabs.sendMessage(tabId, {
      type: 'set-jira-mission-control-login',
      value: url,
    });
  };

  chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleLoadPage,
    filters
  );

  chrome.webNavigation.onCompleted.addListener(handleLoadPage, filters);
})();
