import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";

import { retriever } from "./utils/retriever";

const llm = new Ollama({
  host: "http://localhost:11434",
  model: "smollm:1.7b",
  temperature: 0,
  maxRetries: 2,
});

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {contxt}
question: {question}
answer`;
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(retriever);

// runnable sequnce

const chain = await standaloneQuestionChain.invoke({
  question:
    "What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});
