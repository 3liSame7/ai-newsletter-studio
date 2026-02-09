import json
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from helpers import (
    search_serp,
    pick_best_articles_urls,
    extract_content_from_url,
    summarize,
    generate_newsletter
)

app = FastAPI(title="AI Newsletter Studio API")

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def generate_newsletter_events(query: str):
    """
    Generator function that yields SSE events as each pipeline step completes.
    """
    try:
        # Step 1: Search with Serper API
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 1,
                "label": "Search Results",
                "status": "processing",
                "data": None
            })
        }
        
        search_results = search_serp(query)
        
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 1,
                "label": "Search Results",
                "status": "completed",
                "data": search_results
            })
        }
        
        # Step 2: Pick best article URLs
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 2,
                "label": "Best URLs",
                "status": "processing",
                "data": None
            })
        }
        
        best_urls = pick_best_articles_urls(query, search_results)
        
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 2,
                "label": "Best URLs",
                "status": "completed",
                "data": best_urls
            })
        }
        
        # Step 3: Extract content and summarize
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 3,
                "label": "Article Summary",
                "status": "processing",
                "data": None
            })
        }
        
        db = extract_content_from_url(best_urls)
        summary = summarize(db, query)
        
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 3,
                "label": "Article Summary",
                "status": "completed",
                "data": summary
            })
        }
        
        # Step 4: Generate newsletter
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 4,
                "label": "Newsletter",
                "status": "processing",
                "data": None
            })
        }
        
        newsletter = generate_newsletter(summary, query)
        
        yield {
            "event": "step",
            "data": json.dumps({
                "step": 4,
                "label": "Newsletter",
                "status": "completed",
                "data": newsletter
            })
        }
        
        # Final completion event
        yield {
            "event": "complete",
            "data": json.dumps({"message": "Pipeline completed successfully"})
        }
        
    except Exception as e:
        error_msg = str(e)
        error_trace = traceback.format_exc()
        print(f"Error in pipeline: {error_msg}\n{error_trace}")
        
        yield {
            "event": "error",
            "data": json.dumps({
                "message": error_msg,
                "trace": error_trace
            })
        }

@app.get("/api/search")
async def search_newsletter(query: str):
    """
    SSE endpoint that streams newsletter generation progress.
    Frontend connects via EventSource and receives real-time updates.
    """
    if not query or not query.strip():
        return {"error": "Query parameter is required"}
    
    return EventSourceResponse(generate_newsletter_events(query))

@app.get("/api/health")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "ok", "message": "AI Newsletter Studio API is running"}

# Serve static frontend files in production
# Uncomment after building the frontend
# app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
