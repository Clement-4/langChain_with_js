import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

import { combineDocuments } from "./utils/helper.js";
import { retriever } from "./utils/retriever.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new Ollama({
  host: "http://localhost:11434",
  model: "smollm:1.7b",
  temperature: 0,
  maxRetries: 2,
});

const standaloneQuestionTemplate = `Given a question, convert it to a standalone question. Only give the text output, not code please. 
question: {question} standalone question`;

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend. Only give the text output with maximum 2 lines not more than that. Make sure you are friendly and enthusiastic. not code please.
context: {context}
question: {question}
answer`;

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
  (prevResult) => prevResult.standalone_question,
  retriever,
  combineDocuments,
]);

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: retrieverChain,
    question: ({ original_input }) => original_input.question,
  },
  answerChain,
]);

const response = await chain.invoke({
  question:
    "What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});
