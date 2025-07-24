import { pipeline } from "@xenova/transformers";

class LocalEmbeddings {
  constructor() {
    this.embeddingPipeline = null;
  }

  async initialize() {
    if (!this.embeddingPipeline) {
      this.embeddingPipeline = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
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

export default LocalEmbeddings;
