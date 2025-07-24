import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";

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

const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

const response = await standaloneQuestionChain.invoke({
  question:
    "What are the technical requirements for running Scrimba? I think of doing something cool with scrimba",
});

console.log(response);

// const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

// console.log(tweetPrompt);
