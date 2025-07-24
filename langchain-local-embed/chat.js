import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import EnhancedSupabaseVectorStore from "./enhancedSupabaseVectorStore.js";

const llm = new Ollama({
  host: "http://localhost:11434",
  model: "smollm:1.7b",
  temperature: 0,
  maxRetries: 2,
});
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
const retriever = vectorStore.asRetriever();

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question";

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

const standAloneQuestion = await standaloneQuestionChain.invoke({
  question:
    "What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});

const response = await retriever.invoke(standAloneQuestion);

console.log(response);
