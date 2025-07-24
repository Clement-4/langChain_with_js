import "dotenv/config";
import EnhancedSupabaseVectorStore from "./enhancedSupabaseVectorStore.js";
// import RecommendationSystem from "./recommendation-system.js";
// import Chatbot from "./chatbot.js";
import scrimbaInfo from "./utils/scrimba-info.js";

async function main() {
  const vectorStore = new EnhancedSupabaseVectorStore();
  //   const recommender = new RecommendationSystem();
  //   const chatbot = new Chatbot();

  const embeddings = await vectorStore.generateEmbedding(scrimbaInfo);
  await vectorStore.storeDocument(embeddings);
  console.log("✅ Embedded and stored successfully.");

  //   // Get recommendations
  //   console.log("\n--- Recommendations ---");
  //   const recommendations = await recommender.getQueryRecommendations(
  //     "web development programming",
  //     3
  //   );
  //   console.log("Recommendations:", JSON.stringify(recommendations, null, 2));

  //   // Chat with the bot
  //   console.log("\n--- Chatbot Response ---");
  //   const response = await chatbot.generateResponse(
  //     "What is JavaScript used for?"
  //   );
  //   console.log("Answer:", response.answer);

  //   // Another chat interaction
  //   console.log("\n--- Follow-up Response ---");
  //   const response2 = await chatbot.generateResponse("Tell me more about React");
  //   console.log("Answer:", response2.answer);
}

// Run the example
main().catch(console.error);
