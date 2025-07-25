import "dotenv/config";
import EnhancedSupabaseVectorStore from "./enhancedSupabaseVectorStore.js";
import scrimbaInfo from "./utils/scrimba-info.js";

async function main() {
  const vectorStore = new EnhancedSupabaseVectorStore();

  const embeddings = await vectorStore.generateEmbedding(scrimbaInfo);
  await vectorStore.storeDocument(embeddings);
  console.log("✅ Embedded and stored successfully.");
}

main().catch(console.error);
