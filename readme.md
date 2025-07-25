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

- Stuck at the Open AI key - free tier expired, but changed to the local model

```
locally login using hugginface-cli with the token with write access to upload the model

use api and folder

create a repo and create it
specify the model and tokenizer

model.push_to_hub(repo_id)
tokenizer.push_to_hub(repo_id)
```

- Book are your real companion ad this is always makes the life more interesting, so you are watching this enjoy your each moment. Even the cheap thrills. What are the wealth that is required, the five type of wealth that is required ( that is required by achieving some expermenting), basically it is the book that helps you to grow in personally.

- Because that is the basic thing that everyone knows.

- Robin Sharma, fomo -> don't just believe people blindly

- Hey you are watching naa, message @ babiyonclement18@gmail.com -> only carrer related stuffs and also something that brings improvement ( self improvement )
- TODO: check kilo code or kelo code

- How to take notes
- Brain is good at association, so learn new things with association so that it will be more deeply stored in your brain
- Save it to the savelist so that it will be useful, but it need not to be isolated thoughts.
- Writing is better than typing
- Elloboration and recollection
- Excercise, take proper rest and sleep so that it will help you be more mentally well and physically strong
- Play more and learn more as a learner ( a playful mind )
- Revisting regulary, because as the name suggest
