import { ExtensionServiceWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

let handler: ExtensionServiceWorkerMLCEngineHandler | undefined = undefined;

console.log('[DEBUG] Background script: Running...');

chrome.runtime.onConnect.addListener((port) => {
  console.log('[DEBUG] Background script: port = ', port);
  if (!handler) {
    handler = new ExtensionServiceWorkerMLCEngineHandler(port);
  } else {
    handler.setPort(port);
  }
  port.onMessage.addListener(handler.onmessage.bind(handler));
});

let worker: Worker | null = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'initWorker') {
    initWorker();
    sendResponse({ status: 'initialized' });
  } else if (request.action === 'generateResponse') {
    if (!worker) {
      sendResponse({ error: 'Worker not initialized' });
      return;
    }
    worker.postMessage(request.data);
  }
  return true; // Keeps the message channel open for async response
});

function initWorker() {
  if (!worker) {
    console.log('worker', chrome.runtime.getURL('llm-worker.js'));
    worker = new Worker(chrome.runtime.getURL('llm-worker.js'), {
      type: 'module',
    });

    worker.onmessage = (e) => {
      const { type, data } = e.data;
      if (type === 'chunk' || type === 'complete' || type === 'initProgress') {
        // Forward the message to all tabs or specific tab
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: type, data: data });
          }
        );
      }
    };
  }
}
