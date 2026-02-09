# AI Newsletter Studio

A modern web application that automatically generates professional newsletters from the latest news on any topic using AI.

## Features

- 🎨 **Clean Google-style UI** - Beautiful landing page with gradient logo and centered search
- 🔄 **Real-time Progress** - Progressive stepper UI showing each pipeline stage
- 🤖 **AI-Powered** - Uses Groq LLM (Llama 3.3 70B) for intelligent content analysis
- 📰 **Smart Article Selection** - Automatically finds and selects the best articles
- 📝 **Professional Formatting** - Generates polished, ready-to-send newsletters
- 💾 **Export Options** - Copy to clipboard or download as text file

## Architecture

### Backend (FastAPI)
- **API Server**: `api.py` - FastAPI server with SSE (Server-Sent Events) for real-time updates
- **Pipeline Functions**: `helpers.py` - Core logic for search, selection, summarization, and generation
- **LLM**: Groq API with Llama 3.3 70B Versatile model
- **Search**: Google Serper API for news article discovery
- **Vector Search**: FAISS with HuggingFace embeddings

### Frontend (React + Vite)
- **Framework**: React 19 with Vite for fast development
- **UI Library**: Ant Design for polished components
- **Routing**: React Router for navigation
- **Styling**: CSS with custom gradients and animations
- **Real-time Updates**: EventSource API for SSE connection

## Pipeline Steps

1. **Search Results** - Queries Google Serper API for relevant articles
2. **Best URLs** - LLM selects top 3 most relevant articles
3. **Article Summary** - Extracts and summarizes content using vector search
4. **Newsletter** - Generates formatted newsletter in Tim Ferriss style

## Setup

### Prerequisites
- Python 3.13+ with virtual environment at `langchainenv/`
- Node.js 18+ and npm
- Groq API key
- Google Serper API key

### Environment Variables

Create a `.env` file in the course root:

```env
GROQ_API_KEY=your_groq_api_key_here
Serper_API_KEY=your_serper_api_key_here
```

### Installation

Backend dependencies are already installed in `langchainenv/`:
- fastapi
- sse-starlette
- uvicorn
- langchain
- langchain-groq
- chromadb
- and more...

Frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

### ⚡ Quick Start (Single Command - RECOMMENDED)

Run both frontend and backend together:
```bash
npm run dev
```

This uses `concurrently` to run both servers in one terminal with color-coded output.

---

### Alternative Methods

**Option 1: PowerShell Script**
```powershell
.\start-dev.ps1
```

**Option 2: Batch File**
```bash
start-dev.bat
```

**Option 3: Manual (Two Terminals)**

**Terminal 1 - Backend:**
```bash
python -m uvicorn api:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Usage

1. **Home Page**: Enter any topic in the search box (e.g., "AI breakthroughs", "Climate solutions")
2. **About Button**: Click to learn about agent capabilities and technical implementation
3. **Results Page**: Watch the 4-step stepper progress in real-time:
   - ✅ Search Results - View all found articles
   - ✅ Best URLs - See the 3 selected articles
   - ✅ Summary - Read the combined summary
   - ✅ Newsletter - Get the final formatted newsletter
3. **Export**: Copy to clipboard or download the newsletter

## API Endpoints

- `GET /api/search?query=<topic>` - SSE endpoint for newsletter generation
- `GET /api/health` - Health check endpoint

## Project Structure

```
Projects/Newsletter/
├── api.py                 # FastAPI backend with SSE
├── helpers.py             # Core pipeline functions
├── app.py                 # Legacy CLI script
├── start-dev.bat          # Development launcher
├── README.md              # This file
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx          # Landing page
    │   │   ├── Home.css
    │   │   ├── Results.jsx       # Results with stepper
    │   │   └── Results.css
    │   ├── components/
    │   │   ├── SearchResultCard.jsx
    │   │   ├── URLCard.jsx
    │   │   ├── SummaryCard.jsx
    │   │   ├── NewsletterPreview.jsx
    │   │   └── StepContent.jsx
    │   ├── hooks/
    │   │   └── useNewsletterPipeline.js  # SSE connection hook
    │   ├── App.jsx           # Router setup
    │   ├── main.jsx          # Entry point
    │   └── index.css         # Global styles
    ├── vite.config.js        # Vite config with proxy
    ├── package.json
    └── index.html
```

## Technologies Used

**Backend:**
- FastAPI - Modern Python web framework
- SSE-Starlette - Server-Sent Events support
- LangChain - LLM orchestration framework
- Groq - Fast LLM inference
- FAISS - Vector similarity search
- HuggingFace - Text embeddings

**Frontend:**
- React 19 - UI framework
- Vite - Build tool
- Ant Design - Component library
- React Router - Routing
- EventSource API - SSE client

## Error Handling

- Network errors automatically retry
- Invalid queries show user-friendly messages
- Each pipeline step has try/catch with detailed error reporting
- SSE connection failures display clear error messages

## Future Enhancements

- User accounts and saved newsletters
- Email integration for direct sending
- Multiple newsletter format styles
- Scheduling and automation
- Analytics and tracking
- PDF export with styling

