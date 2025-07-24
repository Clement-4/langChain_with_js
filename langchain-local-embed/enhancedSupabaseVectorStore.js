import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Ollama } from "ollama";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

class EnhancedSupabaseVectorStore {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_API_KEY
    );
    this.ollama = new Ollama({ host: "http://localhost:11434" });
    this.tableName = "documents";
  }

  async generateEmbedding(text) {
    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20,
      });
      const docs = await splitter.createDocuments([text]);
      return docs;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  }

  async storeDocument(content) {
    try {
      const embedding = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: "http://localhost:11434",
      });

      await SupabaseVectorStore.fromDocuments(content, embedding, {
        client: this.supabase,
        tableName: this.tableName,
      });
    } catch (error) {
      console.error("Error storing document:", error);
      throw error;
    }
  }

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

  async generateChatResponse(messages) {
    try {
      const response = await this.ollama.chat({
        model: "smollm:1.7b",
        messages: messages,
        stream: false,
      });
      return response.message.content;
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw error;
    }
  }

  async generateCompletion(prompt, options = {}) {
    try {
      const response = await this.ollama.generate({
        model: "smollm:1.7b",
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

export default EnhancedSupabaseVectorStore;
