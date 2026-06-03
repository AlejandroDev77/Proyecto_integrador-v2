from fastapi import FastAPI
from routes import suite_runner

app = FastAPI(title="QA Service", version="1.0.0")

app.include_router(suite_runner.router, prefix="/qa", tags=["QA Runner"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "qa-service"}