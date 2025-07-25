# Learning Lang Chain

- LangChain helps to build context-aware reasoning applications.

- Learning resource : `https://scrimba.com/learn-langchainjs-c02t/~00`

- Project building the chatbot, the goal is understand the foundation of working of agents not the language ( be language agnostic)

- Steps: Learning the basics with js and open AI

  - Embeddings
  - Working with vector stores
  - Building templates
  - Creating prompts from templates
  - Setting up chains
  - The .pipe() method
  - Retrieving data from vector stores
  - The runnable sequence class

- Prerequisites : Vanilla Javascript, Supabase and obviously langChain

## Basic architecture

- **Building vector store**

  - Information Source -> splitter -> Open AI embeddings will produce chunks -> chunks will be stored in our vector store ( supabase )

- **Application working flow** ( all the steps will be stored in conversational memory)

  - User input -> Open AI model for `creating standalone question s` -> Open AI tool for `create embedding for given question` -> find the `nearest match in vector store` -> resultant vector, `conversational memory` and user input given to `ChatGPT model` for the final answer -> will be rendered onto the dom

## Adding the information for the vector store

- To build the embedding ( vector ), so that AI could understood. Used by netflix, google, spotify for recommendation, predicting stock price.

- Setting up the supabase account for vector store, add the following code for creating the table and algorithm for finding the closest vector.

- If you want to deep diver into vectors, checkout -> `https://supabase.com/blog/openai-embeddings-postgres-vector`

  ```
   -- Enable the pgvector extension to work with embedding vectors
   create extension vector;

   -- Create a table to store your documents
   create table documents (
   id bigserial primary key,
   content text, -- corresponds to Document.pageContent
   metadata jsonb, -- corresponds to Document.metadata
   embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
   );

   -- Create a function to search for documents
   create function match_documents (
   query_embedding vector(1536),
   match_count int DEFAULT null,
   filter jsonb DEFAULT '{}'
   ) returns table (
   id bigint,
   content text,
   metadata jsonb,
   similarity float
   )
   language plpgsql
   as $$
   #variable_conflict use_column
   begin
   return query
   select
       id,
       content,
       metadata,
       1 - (documents.embedding <=> query_embedding) as similarity
   from documents
   where metadata @> filter
   order by documents.embedding <=> query_embedding
   limit match_count;
   end;
   $$;
  ```

```
locally login using hugginface-cli with the token with write access to upload the model

use api and folder

create a repo and create it
specify the model and tokenizer

model.push_to_hub(repo_id)
tokenizer.push_to_hub(repo_id)
```
