import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

import scrimbaInfo from "./utils/scrimba-info.js";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});
const docs = await splitter.createDocuments([scrimbaInfo]);

// Embeddings model
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2",
});

// Supabase client
const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Upload to Supabase
await SupabaseVectorStore.fromDocuments(docs, embeddings, {
  client,
  tableName: "documents",
});

console.log("✅ Embedded and stored successfully.");
