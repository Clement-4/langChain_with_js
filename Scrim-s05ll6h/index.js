import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";

import scrimbaInfo from "./utils/scrimba-info.js";

try {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""],
  });
  const output = await splitter.createDocuments([scrimbaInfo]);

  const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
  const sbUrl = import.meta.env.VITE_SUPABASE_URL_LC_CHATBOT;
  const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const client = createClient(sbUrl, sbApiKey);
} catch (err) {
  console.log("Error occurs : " + err.message);
}
