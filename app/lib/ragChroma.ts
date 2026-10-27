const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const CHROMA_HOST = process.env.CHROMA_HOST || 'localhost';
const CHROMA_PORT = parseInt(process.env.CHROMA_PORT || '8000', 10);
const COLLECTION_ID = 'fda06c91-8b86-4c79-bf32-03673f1127e9';

export async function generateGeminiEmbedding(text: string): Promise<number[]> {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: cleanText }] },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini Embedding API failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.embedding.values as number[];
}

export async function queryAyurvedaKnowledge(
  query: string,
  topK: number = 4
): Promise<Array<{ text: string; source: string; page?: number; distance?: number }>> {
  try {
    const queryEmbedding = await generateGeminiEmbedding(query);

    const chromaUrl = `http://${CHROMA_HOST}:${CHROMA_PORT}/api/v2/tenants/default_tenant/databases/default_database/collections/${COLLECTION_ID}/query`;

    const res = await fetch(chromaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        n_results: topK,
        query_embeddings: [queryEmbedding],
        include: ['documents', 'metadatas', 'distances'],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Chroma REST API error (${res.status}):`, err);
      return [];
    }

    const data = await res.json();
    const docs = data.documents?.[0] || [];
    const metadatas = data.metadatas?.[0] || [];
    const distances = data.distances?.[0] || [];

    return docs.map((docText: string, idx: number) => ({
      text: docText || '',
      source: (metadatas[idx]?.source as string) || 'Ayurveda Reference',
      page: (metadatas[idx]?.page as number) || undefined,
      distance: distances[idx] !== null ? distances[idx] : undefined,
    }));
  } catch (error) {
    console.error('Error querying ChromaDB:', error);
    return [];
  }
}
