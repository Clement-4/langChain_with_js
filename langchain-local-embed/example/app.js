// ## Key Benefits of Local Models:

// 1. **Privacy**: No data leaves your machine
// 2. **Cost**: No API costs
// 3. **Speed**: Fast local inference (depending on hardware)
// 4. **Customization**: Full control over the model
// 5. **Offline**: Works without internet connection

// ## Important Notes:

// 1. **Embedding Model**: Make sure to use a proper embedding model like `nomic-embed-text` for better similarity search
// 2. **Performance**: Local models might be slower than cloud APIs
// 3. **Hardware**: Ensure you have sufficient RAM/CPU for running models
// 4. **Model Size**: Smoll3 is relatively small but still requires resources

// This setup gives you a fully local AI system using Supabase for vector storage and Ollama for local model inference!

// ## 1. Setup Ollama and Local Model

// First, install Ollama and pull the model: INFO: I am going to use docker model runner

```bash
# Install Ollama from https://ollama.com/download
# Then pull the model
ollama pull smoll3:latest
``` // ## 2. Updated Dependencies
```bash
npm install @supabase/supabase-js ollama
``` // ## 3. Updated Core Implementation
``; //javascript
supabase - vector - store.js;
import { createClient } from "@supabase/supabase-js";
import { Ollama } from "ollama";

class SupabaseVectorStore {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    this.ollama = new Ollama({ host: "http://localhost:11434" });
  }

  // Generate embeddings using local model
  async generateEmbedding(text) {
    try {
      // Note: You might need to use a specific embedding model
      // For embeddings, you might want to use nomic-embed-text or similar
      const response = await this.ollama.embeddings({
        model: "nomic-embed-text", // or another local embedding model
        prompt: text,
      });
      return response.embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      // Fallback: create a simple embedding (not recommended for production)
      return this.createSimpleEmbedding(text);
    }
  }

  // Simple fallback embedding (for demonstration)
  createSimpleEmbedding(text) {
    // This is a very basic approach - use a proper local embedding model in production
    const words = text.toLowerCase().split(" ");
    const embedding = new Array(384).fill(0); // Assuming 384-dim embedding

    words.forEach((word, index) => {
      if (index < embedding.length) {
        embedding[index] = word.length / 20; // Normalize word length
      }
    });

    return embedding;
  }

  // Store document with embedding
  async storeDocument(content, metadata = {}) {
    try {
      const embedding = await this.generateEmbedding(content);

      const { data, error } = await this.supabase
        .from("documents")
        .insert([
          {
            content,
            metadata,
            embedding,
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error storing document:", error);
      throw error;
    }
  }

  // Search for similar documents
  async searchSimilar(query, limit = 5, threshold = 0.7) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);

      const { data, error } = await this.supabase.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error searching documents:", error);
      throw error;
    }
  }

  // Generate response using local model
  async generateResponse(prompt) {
    try {
      const response = await this.ollama.generate({
        model: "smoll3:latest",
        prompt: prompt,
        stream: false,
      });
      return response.response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}

// export default SupabaseVectorStore
`` // For better embeddings, use a dedicated local embedding model: // ## 4. Better Local Embedding Solution
```bash
# Pull a good embedding model
ollama pull nomic-embed-text
`; //javascript
// enhanced-supabase-vector-store.js
import { createClient } from "@supabase/supabase-js";
import { Ollama } from "ollama";

class EnhancedSupabaseVectorStore {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    this.ollama = new Ollama({ host: "http://localhost:11434" });
  }

  // Generate embeddings using local embedding model
  async generateEmbedding(text) {
    try {
      const response = await this.ollama.embeddings({
        model: "nomic-embed-text", // Better local embedding model
        prompt: text,
      });
      return response.embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  }

  // Store document with embedding
  async storeDocument(content, metadata = {}) {
    try {
      const embedding = await this.generateEmbedding(content);

      const { data, error } = await this.supabase
        .from("documents")
        .insert([
          {
            content,
            metadata,
            embedding,
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error storing document:", error);
      throw error;
    }
  }

  // Search for similar documents
  async searchSimilar(query, limit = 5, threshold = 0.7) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);

      const { data, error } = await this.supabase.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error searching documents:", error);
      throw error;
    }
  }

  // Generate response using local model
  async generateChatResponse(messages) {
    try {
      const response = await this.ollama.chat({
        model: "smoll3:latest",
        messages: messages,
        stream: false,
      });
      return response.message.content;
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw error;
    }
  }

  // Simple completion
  async generateCompletion(prompt, options = {}) {
    try {
      const response = await this.ollama.generate({
        model: "smoll3:latest",
        prompt: prompt,
        stream: false,
        ...options,
      });
      return response.response;
    } catch (error) {
      console.error("Error generating completion:", error);
      throw error;
    }
  }
}

// export default EnhancedSupabaseVectorStore
`
 // ## 5. Updated Recommendation System

`; //javascript
// recommendation-system.js
import EnhancedSupabaseVectorStore from "./enhanced-supabase-vector-store.js";

class RecommendationSystem {
  constructor() {
    this.vectorStore = new EnhancedSupabaseVectorStore();
  }

  // Content-based recommendations
  async getRecommendations(userId, preferences, limit = 5) {
    try {
      // Create a preference query based on user interests
      const preferenceQuery =
        "Recommend content similar to: ${preferences.join(', ')}";

      const similarItems = await this.vectorStore.searchSimilar(
        preferenceQuery,
        limit
      );

      return similarItems.map((item) => ({
        id: item.id,
        content: item.content,
        metadata: item.metadata,
        score: item.similarity,
      }));
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  }

  // Get recommendations based on user query
  async getQueryRecommendations(query, limit = 5) {
    try {
      const similarItems = await this.vectorStore.searchSimilar(query, limit);
      return similarItems.map((item) => ({
        id: item.id,
        content: item.content,
        metadata: item.metadata,
        score: item.similarity,
      }));
    } catch (error) {
      console.error("Error getting query recommendations:", error);
      throw error;
    }
  }
}

// export default RecommendationSystem
``` // ## 6. Updated Chatbot Implementation
`;
//javascript
// chatbot.js
import EnhancedSupabaseVectorStore from "./enhanced-supabase-vector-store.js";

class Chatbot {
  constructor() {
    this.vectorStore = new EnhancedSupabaseVectorStore();
    this.conversationHistory = [];
  }

  // Retrieve relevant context for the query
  async retrieveContext(query, limit = 3) {
    try {
      const relevantDocs = await this.vectorStore.searchSimilar(query, limit);
      return relevantDocs.map((doc) => doc.content).join("\n\n");
    } catch (error) {
      console.error("Error retrieving context:", error);
      return "";
    }
  }

  // Generate response using retrieved context
  async generateResponse(query, userId = null) {
    try {
      // Get relevant context
      const context = await this.retrieveContext(query);

      // Build conversation history
      const history = this.conversationHistory
        .slice(-4) // Keep last 4 exchanges
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Create prompt with context
      const systemPrompt = `You are a helpful assistant. Use the following context to answer the question.
If the context doesn't contain relevant information, say so politely.

Context:
${context}

Conversation History:
${history}`;

      // Prepare messages for chat
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ];

      // Generate response using local model
      const answer = await this.vectorStore.generateChatResponse(messages);

      // Update conversation history
      this.conversationHistory.push(
        { role: "user", content: query },
        { role: "assistant", content: answer }
      );

      return {
        answer,
        context: context ? context.split("\n\n") : [],
        sources: [], // You can add source tracking here
      };
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }

  // Simple completion-based response
  async generateSimpleResponse(query) {
    try {
      const context = await this.retrieveContext(query);

      const prompt = `Context: ${context}

Question: ${query}

Answer:`;

      const answer = await this.vectorStore.generateCompletion(prompt, {
        temperature: 0.7,
        max_tokens: 500,
      });

      return {
        answer,
        context: context ? context.split("\n\n") : [],
      };
    } catch (error) {
      console.error("Error generating simple response:", error);
      throw error;
    }
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }
}

// export default Chatbot
```

## 7. Usage Example

`; //javascript
// app.js
import EnhancedSupabaseVectorStore from "./enhanced-supabase-vector-store.js";
import RecommendationSystem from "./recommendation-system.js";
import Chatbot from "../chatbot.js";

async function main() {
  // Initialize systems
  const vectorStore = new EnhancedSupabaseVectorStore();
  const recommender = new RecommendationSystem();
  const chatbot = new Chatbot();

  // Test embedding generation
  console.log("Testing embedding generation...");
  const testEmbedding = await vectorStore.generateEmbedding("Hello world");
  console.log("Embedding generated, length:", testEmbedding.length);

  // Store some sample data
  await vectorStore.storeDocument(
    "JavaScript is a versatile programming language used for web development",
    { type: "tutorial", category: "programming", difficulty: "beginner" }
  );

  await vectorStore.storeDocument(
    "React is a popular JavaScript library for building user interfaces",
    { type: "tutorial", category: "programming", difficulty: "intermediate" }
  );

  await vectorStore.storeDocument(
    "Python is great for data science and machine learning",
    { type: "tutorial", category: "programming", difficulty: "beginner" }
  );

  // Get recommendations
  console.log("\n--- Recommendations ---");
  const recommendations = await recommender.getQueryRecommendations(
    "web development programming",
    3
  );
  console.log("Recommendations:", JSON.stringify(recommendations, null, 2));

  // Chat with the bot
  console.log("\n--- Chatbot Response ---");
  const response = await chatbot.generateResponse(
    "What is JavaScript used for?"
  );
  console.log("Answer:", response.answer);

  // Another chat interaction
  console.log("\n--- Follow-up Response ---");
  const response2 = await chatbot.generateResponse("Tell me more about React");
  console.log("Answer:", response2.answer);
}

// Run the example
main().catch(console.error)```

// ## 8. Alternative: Using Transformers.js for Embeddings

// If you want even more control, you can use Transformers.js for local embeddings:

``` //npm install @xenova/transformers //bash
```

```; //javascript
// local-embeddings.js
import { pipeline } from "@xenova/transformers";

class LocalEmbeddings {
  constructor() {
    this.embeddingPipeline = null;
  }

  async initialize() {
    if (!this.embeddingPipeline) {
      this.embeddingPipeline = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2" // Small, efficient embedding model
      );
    }
  }

  async generateEmbedding(text) {
    await this.initialize();

    const output = await this.embeddingPipeline(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  }
}

export default LocalEmbeddings``;
