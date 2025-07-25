import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import EnhancedSupabaseVectorStore from "../enhancedSupabaseVectorStore.js";

const store = new EnhancedSupabaseVectorStore();

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434",
});

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: store.getClient(),
  tableName: "documents",
  queryName: "match_documents",
});
export const retriever = vectorStore.asRetriever();
