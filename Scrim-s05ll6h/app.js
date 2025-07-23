import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

import scrimbaInfo from "./utils/scrimba-info.js";

try {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
    separators: ["\n\n", "\n", " ", ""],
  });

  const output = await splitter.createDocuments([scrimbaInfo]);

  const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
  const sbUrl = import.meta.env.VITE_SUPABASE_URL_LC_CHATBOT;

  const client = createClient(sbUrl, sbApiKey);

  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
  });

  await SupabaseVectorStore.fromDocuments(output, embeddings, {
    client,
    tableName: "documents",
  });
} catch (err) {
  console.log("Error occurs : " + err.message);
}
