import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";

const llm = new Ollama({
  host: "http://localhost:11434",
  model: "smollm2:latest",
  temperature: 0,
  maxRetries: 2,
});

const punctuationTemplate = `Given a sentence, add punctuation where needed. 
    sentence: {sentence}
    sentence with punctuation:  
    `;
const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate);

const grammarTemplate = `Given a sentence correct the grammar.Only give the output not code.
    sentence: {punctuated_sentence}
    sentence with correct grammar: 
    `;
const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);

const translationTemplate = `Given a sentence, translate that sentence into {language}
    sentence: {grammatically_correct_sentence}
    translated sentence:
    `;
const translationPrompt = PromptTemplate.fromTemplate(translationTemplate);

const punctuationChain = RunnableSequence.from([punctuationPrompt, llm]);
const grammarChain = RunnableSequence.from([grammarPrompt, llm]);
const translationChain = RunnableSequence.from([translationPrompt, llm]);

const chain = RunnableSequence.from([
  {
    punctuated_sentence: punctuationChain,
    original_input: new RunnablePassthrough(),
  },
  {
    grammatically_correct_sentence: grammarChain,
    language: ({ original_input }) => original_input.language,
  },
  translationChain,
]);

const response = await chain.invoke({
  sentence: "i dont liked mondays",
  language: "french",
});

console.log(response);
