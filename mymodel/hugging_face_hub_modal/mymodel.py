from datasets import load_dataset
from transformers import BertTokenizerFast, BertForSequenceClassification, TrainingArguments, Trainer

# Load dataset
dataset = load_dataset("imdb")

# Load tokenizer
tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")

# Tokenization function
def tokenize_dataset(examples):
    return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)

# Tokenize dataset
tokenized_dataset = dataset.map(tokenize_dataset, batched=True)

# Fix 1: You mistakenly overwrote 'tokenized_dataset' with the function instead of applying methods on the dataset
# Fix 2: Chaining like this leads to bugs; better to do in steps

# Remove unnecessary column
tokenized_dataset = tokenized_dataset.remove_columns(["text"])

# Rename 'label' to 'labels'
tokenized_dataset = tokenized_dataset.rename_column("label", "labels")

# Set format for PyTorch
tokenized_dataset.set_format("torch")

# Load model
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

# Fix 3: Typo in 'output_dir'
training_args = TrainingArguments(
    output_dir="./results", 
    # evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01
)

# Fix 4: You passed 'tokenize_dataset["train"]' instead of 'tokenized_dataset["train"]'
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["test"]
)

# Train model
trainer.train()

# Save model and tokenizer
model.save_pretrained("./mymodel")
tokenizer.save_pretrained("./mymodel")
