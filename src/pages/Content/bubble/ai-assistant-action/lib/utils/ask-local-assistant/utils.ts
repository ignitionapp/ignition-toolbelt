import { pipeline, FeatureExtractionPipeline, env } from '@xenova/transformers';
import type { HistoryItem } from '../../types'

env.useBrowserCache = true;
env.allowLocalModels = true;

export type EmbeddingModelType = FeatureExtractionPipeline;

let embeddingModel: EmbeddingModelType | null = null;
let isModelLoading = false;

const initEmbeddingModel = async (onProgress?: (progress: number) => void) => {
  if (embeddingModel) return embeddingModel;
  if (isModelLoading) return null;

  isModelLoading = true;

  try {
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      progress_callback: (progress: number) => {
        onProgress?.(progress);
      }
    });
  } catch (error) {
    console.error('加載模型時出錯:', error);
  } finally {
    isModelLoading = false;
  }

  return embeddingModel;
};

const getEmbeddings = async (texts: string[], onProgress?: (progress: number) => void) => {
  const model = await initEmbeddingModel(onProgress);
  if (!model) return null;
  const embeddings = await Promise.all(texts.map(text => model(text, { pooling: 'mean', normalize: true })));
  return embeddings;
};

const cosineSimilarity = (a: number[], b: number[]) => {
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

initEmbeddingModel();

export const manageConversationHistory = async (
  history: HistoryItem[],
  newMessage: string,
  maxTokens: number,
  onProgress?: (progress: number) => void
): Promise<HistoryItem[]> => {
  const allMessages = [...history.map(item => item.message), newMessage].filter(Boolean) as string[];
  const embeddings = await getEmbeddings(allMessages, onProgress);

  if (!embeddings) {
    return history.slice(-5).concat({ sender: 'user', message: newMessage });
  }

  const newMessageEmbedding = embeddings[embeddings.length - 1];
  const historySimilarities = history.map((_, index) =>
    cosineSimilarity(newMessageEmbedding.tolist(), embeddings[index].tolist())
  );

  const sortedHistory = history
    .map((item, index) => ({ ...item, similarity: historySimilarities[index] }))
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));

  const managedHistory: HistoryItem[] = [];
  let tokenCount = newMessage.split(' ').length;

  managedHistory.push({ sender: 'user', message: newMessage });

  for (const item of sortedHistory) {
    const itemTokens = item.message?.split(' ').length || 0;
    if (tokenCount + itemTokens <= maxTokens) {
      managedHistory.push(item);
      tokenCount += itemTokens;
    } else {
      break;
    }
  }

  return managedHistory;
};

