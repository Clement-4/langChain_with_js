from huggingface_hub import HfApi,HfFolder
from transformers import AutoModelForSequenceClassification,AutoTokenizer
api=HfApi()

token=HfFolder.get_token()

repo="Clement-127001/mymodel"
api.create_repo(repo_id=repo,token=token)

model=AutoModelForSequenceClassification.from_pretrained("./mymodel")
tokenizer=AutoTokenizer.from_pretrained("./mymodel")

model.push_to_hub(repo)
token.push_to_hub(repo)
