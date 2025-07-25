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
  model: "smollm2:latest",
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

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer questions about Scrimba using the context below.
INSTRUCTIONS:
- Answer using ONLY the information in the context.
- Be friendly, enthusiastic and optimist.
- If you don’t know the answer, say: "I'm sorry, I don't know the answer to that." and direct the user to email help@scrimba.com.
- Do NOT make up anything.
- Your answer MUST be in 2 short lines or less.
- Do NOT include any code.

context: {context}
question: {question}
answer:`;

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

console.log(response);
