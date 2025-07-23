import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import scrimbaInfo from "./utils/scrimba-info.js";

try {
  try {
    const splitter = new RecursiveCharacterTextSplitter();
    const output = await splitter.createDocuments([scrimbaInfo]);
    console.log(output);
  } catch (err) {
    console.log("Error occurs : " + err.message);
  }
} catch (err) {
  console.log(err);
}
