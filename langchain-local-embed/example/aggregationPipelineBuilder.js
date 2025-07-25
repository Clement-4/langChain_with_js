import "dotenv/config";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { Ollama } from "@langchain/ollama";

import { retriever } from "../utils/retriever.js";
import { combineDocuments } from "../utils/helper.js";

async function buildAggregationPipeline() {
  const llm = new Ollama({
    host: "http://localhost:11434",
    model: "smollm2:latest",
    temperature: 0,
    maxRetries: 2,
  });

  const standalonePromptTemplate = `Given a query, convert it to a standalone question for converting the natural language query into aggregation pipeline. Only give the text output, not code please.
  question: {question}
  standalone question:`;

  const standalonePrompt = PromptTemplate.fromTemplate(
    standalonePromptTemplate
  );

  const standaloneChain = standalonePrompt
    .pipe(llm)
    .pipe(new StringOutputParser());

  //INFO: this chain can be skipped if we don't want to embed the schema structure
  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standalone_aggregation_question,
    retriever,
    new RunnablePassthrough().pipe(async (docs) => ({
      context: combineDocuments(docs),
    })),
  ]);

  const pipelinePromptTemplate = `You are a helpful aggregation query builder who converts a seller's natural language query into a MongoDB aggregation pipeline.

    INSTRUCTIONS:
    - Use ONLY the fields and types defined in the schemat.
    - Do NOT make up field names or types.
    - Always return a JSON array representing the MongoDB aggregation pipeline.
    - If unsure, respond: "I'm sorry, I don't know the answer to that." and direct the user to email support@storehippo.com.

    MongoDB Schema:
    {schema}

    Question:
    {question}

    Aggregation Pipeline (JSON):`;

  const pipelinePrompt = PromptTemplate.fromTemplate(pipelinePromptTemplate);

  const aggregationPipelineChain = pipelinePrompt
    .pipe(llm)
    .pipe(new StringOutputParser());

  const queryPipeline = RunnableSequence.from([
    {
      standalone_aggregation_question: standaloneChain,
      original_input: new RunnablePassthrough(),
    },
    {
      question: ({ original_input }) => original_input.question,
      schema: ({ original_input }) => original_input.schema,
      // context: retrieverChain, //INFO: uncomment if we want embedding for the schema
    },
    aggregationPipelineChain,
  ]);

  try {
    const response = await queryPipeline.invoke({
      question:
        "Build the aggregation pipeline for getting the coupon codes name, amount, type and sort them according to the name in ascending order and filter only the coupon codes which have either a flat discount greater than 5% or amount greater than 50.",
      schema: `
        const CouponSchema = new mongoose.Schema({
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["flat", "percentage"],
            required: true,
        },
        amount: {
            type: Number,
            // Required only if type is "flat"
            required: function () { return this.type === "flat"; },
        },
        discountPercentage: {
            type: Number,
            // Required only if type is "percentage"
            required: function () { return this.type === "percentage"; },
        },
        createdAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["active", "expired"],
            default: "active",
        },
        });
    `,
    });

    console.log("Generated Aggregation Pipeline:\n", response);
  } catch (err) {
    console.log("[Error occured] : " + err);
  }
}

buildAggregationPipeline();
