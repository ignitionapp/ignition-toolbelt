console.log('[DEBUG] Content script: Running...');
export const setLocalAIAssistant = () => {
  chrome.runtime.onConnect.addListener((port) => {
    console.log('[DEBUG] Content script: port = ', port);
    port.onMessage.addListener(function (msg) {
      port.postMessage({ contents: document.body.innerHTML });
    });
  });
};
