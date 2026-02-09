import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Modal, Typography, Space, Divider, Tag } from 'antd'
import { SearchOutlined, InfoCircleOutlined, RobotOutlined, ThunderboltOutlined, ApiOutlined, DatabaseOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons'
import './Home.css'

const { Title, Paragraph, Text } = Typography

function Home() {
  const [query, setQuery] = useState('')
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const handleSearch = () => {
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      console.log('Navigating with query:', trimmedQuery)
      navigate(`/results?query=${encodeURIComponent(trimmedQuery)}`)
    } else {
      console.log('Empty query, not navigating')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="home-container">
      <div className="top-buttons">
        <Button
          className="theme-toggle-button"
          icon={darkMode ? <BulbFilled /> : <BulbOutlined />}
          onClick={() => setDarkMode(!darkMode)}
          size="large"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        />
        <Button
          className="about-button"
          icon={<InfoCircleOutlined />}
          onClick={() => setAboutModalOpen(true)}
          size="large"
        >
          About
        </Button>
      </div>

      <div className="home-content">
        <h1 className="home-title gradient-text">
          AI Newsletter Studio
        </h1>
        <p className="home-subtitle">
          AI-powered newsletter generation from the latest news on any topic
        </p>
        <div className="search-box">
          <Input
            placeholder="Enter a topic (e.g., AI news, Climate change, Space exploration)"
            size="large"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            allowClear
            className="search-input"
          />
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            disabled={!query.trim()}
            className="search-button"
          >
            Generate
          </Button>
        </div>
        <div className="examples">
          <span className="examples-label">Try:</span>
          {['AI breakthroughs', 'Climate solutions', 'Space exploration'].map((example) => (
            <Button
              key={example}
              type="link"
              size="small"
              onClick={() => {
                setQuery(example)
                // Small delay to update state before navigation
                setTimeout(() => {
                  navigate(`/results?query=${encodeURIComponent(example)}`)
                }, 50)
              }}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      <Modal
        title={
          <Space>
            <RobotOutlined style={{ fontSize: 24, color: '#4285f4' }} />
            <span>About AI Newsletter Studio</span>
          </Space>
        }
        open={aboutModalOpen}
        onCancel={() => setAboutModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setAboutModalOpen(false)}>
            Got it!
          </Button>
        ]}
        width={700}
        className={darkMode ? 'dark-mode-modal' : ''}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}><ThunderboltOutlined /> Agent Capabilities</Title>
            <Paragraph>
              Our intelligent agent autonomously handles the entire newsletter creation pipeline:
            </Paragraph>
            <ul style={{ lineHeight: 2 }}>
              <li><strong>Smart Search:</strong> Queries Google Serper API to discover relevant news articles</li>
              <li><strong>AI Selection:</strong> Uses Groq's Llama 3.3 70B model to intelligently pick the top 3 most relevant articles</li>
              <li><strong>Content Analysis:</strong> Extracts and chunks article text using vector embeddings for semantic search</li>
              <li><strong>Intelligent Summarization:</strong> Leverages LLM with RAG (Retrieval Augmented Generation) to create concise summaries</li>
              <li><strong>Professional Formatting:</strong> Generates polished, ready-to-send newsletters in customizable styles</li>
            </ul>
          </div>

          <Divider />

          <div>
            <Title level={4}><ApiOutlined /> Technical Implementation</Title>
            <Space wrap style={{ marginBottom: 12 }}>
              <Tag color="blue">FastAPI</Tag>
              <Tag color="purple">React</Tag>
              <Tag color="green">LangChain</Tag>
              <Tag color="orange">Groq AI</Tag>
              <Tag color="cyan">FAISS</Tag>
              <Tag color="magenta">Ant Design</Tag>
            </Space>
            <Paragraph>
              <Text strong>Backend Architecture:</Text>
            </Paragraph>
            <ul style={{ lineHeight: 1.8 }}>
              <li><strong>FastAPI + SSE:</strong> Real-time streaming of pipeline progress using Server-Sent Events</li>
              <li><strong>Groq LLM:</strong> Ultra-fast inference with Llama 3.3 70B Versatile model</li>
              <li><strong>Vector Store:</strong> FAISS with HuggingFace embeddings for semantic similarity search</li>
              <li><strong>LangChain:</strong> Orchestrates LLM chains, document loaders, and text splitters</li>
            </ul>
            <Paragraph style={{ marginTop: 12 }}>
              <Text strong>Frontend Architecture:</Text>
            </Paragraph>
            <ul style={{ lineHeight: 1.8 }}>
              <li><strong>React 19 + Vite:</strong> Modern, fast development with hot module replacement</li>
              <li><strong>Ant Design:</strong> Professional UI components with progressive stepper visualization</li>
              <li><strong>EventSource API:</strong> Native SSE client for real-time updates without polling</li>
              <li><strong>React Router:</strong> Seamless navigation between home and results pages</li>
            </ul>
          </div>

          <Divider />

          <div>
            <Title level={4}><DatabaseOutlined /> Data Flow</Title>
            <Paragraph>
              <Text code>User Query</Text> → <Text code>Serper API Search</Text> → 
              <Text code>LLM Article Selection</Text> → <Text code>Content Extraction</Text> → 
              <Text code>Vector Embedding</Text> → <Text code>Similarity Search</Text> → 
              <Text code>LLM Summary</Text> → <Text code>Newsletter Generation</Text> → 
              <Text code>User Export</Text>
            </Paragraph>
            <Paragraph type="secondary" style={{ fontSize: 13, marginTop: 12 }}>
              Each step streams progress in real-time to the frontend, 
              providing instant feedback and allowing users to review intermediate results.
            </Paragraph>
          </div>
        </Space>
      </Modal>
    </div>
  )
}

export default Home
