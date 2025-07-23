import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";

// const baseUrl =
//   process.env.OPENAI_API_BASE_URL ||
//   "http://localhost:12434/engines/llama.cpp/v1";

//INFO: don't run the modal locally, even if you are having mac. it actually makes my machine crazy
const llm = new Ollama({
  model: "llama3",
  temperature: 0,
  maxRetries: 2,
});

// const tweetTemplate =
//   "Generate a promotional tweet for a product, from this product description:{productDesc}";

/**
 * Challenge:
 * 1. Create a prompt to turn a user's question into a
 *    standalone question. (Hint: the AI understands
 *    the concept of a standalone question. You don't
 *    need to explain it, just ask for it.)
 * 2. Create a chain with the prompt and the model.
 * 3. Invoke the chain remembering to pass in a question.
 * 4. Log out the response.
 * **/

// A string holding the phrasing of the prompt
const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question";

// A prompt created using PromptTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

// Take the standaloneQuestionPrompt and PIPE the model
const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

// Await the response when you INVOKE the chain.
// Remember to pass in a question.
const response = await standaloneQuestionChain.invoke({
  question:
    "What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.",
});

console.log(response);

// const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate);

// console.log(tweetPrompt);
