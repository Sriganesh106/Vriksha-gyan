import * as fs from 'fs';
import * as path from 'path';
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ChromaClient, EmbeddingFunction } from 'chromadb';

let envKey = '';
try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
  const match = envContent.match(/GEMINI_API_KEY=(.+)/);
  if (match && match[1]) {
    envKey = match[1].trim();
  }
} catch (e) {}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || envKey;
const CHROMA_HOST = process.env.CHROMA_HOST || 'localhost';
const CHROMA_PORT = parseInt(process.env.CHROMA_PORT || '8000', 10);
const COLLECTION_NAME = 'ayurveda_knowledge';

class GeminiEmbeddingFunction implements EmbeddingFunction {
  async generate(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;

    for (let i = 0; i < texts.length; i++) {
      const cleanText = texts[i].replace(/\s+/g, ' ').trim();
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: { parts: [{ text: cleanText }] }
          })
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Embedding API error ${response.status}: ${err}`);
        }

        const data = await response.json();
        embeddings.push(data.embedding.values as number[]);

        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (e) {
        console.error(`Failed to embed chunk ${i}:`, e);
        throw e;
      }
    }
    return embeddings;
  }
}

async function extractTextFromPDF(pdfPath: string): Promise<string[]> {
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse(new Uint8Array(buf));
  const result: any = await (parser as any).getText();
  
  if (Array.isArray(result.pages)) {
    return result.pages.map((p: any) => p.text || '');
  } else if (typeof result === 'string') {
    return [result];
  } else {
    const pages: string[] = [];
    for (let i = 1; i <= (result.total || 0); i++) {
      if (result[i]) pages.push(result[i]);
    }
    return pages.length > 0 ? pages : [JSON.stringify(result)];
  }
}

async function ingest() {
  console.log('🚀 Starting Ayurvedic PDF Ingestion into ChromaDB...');

  const client = new ChromaClient({ host: CHROMA_HOST, port: CHROMA_PORT, ssl: false });
  const embedder = new GeminiEmbeddingFunction();

  const collection = await client.getOrCreateCollection({
    name: COLLECTION_NAME,
    embeddingFunction: embedder,
    metadata: { description: 'Ayurvedic Medical Knowledge Base' }
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 100,
  });

  const pdfFiles = [
    {
      file: 'Ayurvedic-Home-Remedies-English.pdf',
      title: 'Ayurvedic Home Remedies Guide',
      maxPages: 33
    },
    {
      file: 'Evidence_based_Ayurvedic_Practice.pdf',
      title: 'Evidence Based Ayurvedic Practice',
      maxPages: 100
    }
  ];

  for (const { file, title, maxPages } of pdfFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found: ${file}`);
      continue;
    }

    console.log(`\n📖 Processing PDF: ${file} ...`);
    const pages = await extractTextFromPDF(fullPath);
    const processCount = Math.min(pages.length, maxPages);
    console.log(`Processing ${processCount} pages from ${file}...`);

    for (let pageIdx = 0; pageIdx < processCount; pageIdx++) {
      const pageText = pages[pageIdx]?.trim() || '';
      if (!pageText || pageText.length < 30) continue;

      const chunks = await splitter.splitText(pageText);
      if (chunks.length === 0) continue;

      const ids = chunks.map((_, i) => `${path.basename(file, '.pdf')}_p${pageIdx + 1}_c${i}`);
      const metadatas = chunks.map(() => ({
        source: title,
        filename: file,
        page: pageIdx + 1,
      }));

      try {
        console.log(`[${title}] Ingesting page ${pageIdx + 1}/${processCount} (${chunks.length} chunks)...`);
        await collection.add({
          ids,
          documents: chunks,
          metadatas,
        });
      } catch (err: any) {
        console.error(`Error saving page ${pageIdx + 1}:`, err.message || err);
      }
    }
  }

  const count = await collection.count();
  console.log(`\n🎉 Ingestion complete! Total active chunks stored in ChromaDB: ${count}`);
}

ingest().catch(console.error);
