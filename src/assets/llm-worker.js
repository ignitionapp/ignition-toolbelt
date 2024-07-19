import * as webllm from '@mlc-ai/web-llm';

let engine = null;

self.onmessage = async function (e) {
  const { messages, isFunctionCall, tools } = e.data;

  if (!engine) {
    engine = await webllm.CreateMLCEngine(
      'Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC',
      {
        initProgressCallback: (report) =>
          self.postMessage({ type: 'initProgress', data: report }),
      }
    );
  }

  const asyncChunkGenerator = await engine.chat.completions.create({
    messages: messages,
    tools: isFunctionCall ? tools : undefined,
    tool_choice: isFunctionCall ? 'auto' : undefined,
    stream: true,
    stream_options: {
      include_usage: true,
    },
    temperature: 0,
  });

  for await (const chunk of asyncChunkGenerator) {
    console.log('chunk', chunk);
    self.postMessage({ type: 'chunk', data: chunk });
  }

  self.postMessage({ type: 'complete' });
};
