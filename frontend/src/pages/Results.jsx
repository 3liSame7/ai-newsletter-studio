import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Layout, Steps, Input, Button, Alert, Space } from 'antd'
import { SearchOutlined, HomeOutlined } from '@ant-design/icons'
import { useNewsletterPipeline } from '../hooks/useNewsletterPipeline'
import StepContent from '../components/StepContent'
import './Results.css'

const { Header, Content } = Layout
const { Search } = Input

const STEPS = [
  { title: 'Search Results', description: 'Finding articles' },
  { title: 'Best URLs', description: 'Selecting top articles' },
  { title: 'Summary', description: 'Analyzing content' },
  { title: 'Newsletter', description: 'Generating newsletter' },
]

function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('query')
  
  const [selectedStep, setSelectedStep] = useState(0)
  const [searchQuery, setSearchQuery] = useState(query || '')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')

  const {
    currentStep,
    stepData,
    stepStatus,
    loading,
    error,
    completed,
    retry,
  } = useNewsletterPipeline(query)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  // Auto-select the current step as it progresses
  useEffect(() => {
    if (currentStep > 0) {
      setSelectedStep(currentStep - 1)
    }
  }, [currentStep])

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/results?query=${encodeURIComponent(value.trim())}`)
    }
  }

  const handleStepClick = (step) => {
    // Only allow clicking on completed or current steps
    if (stepStatus[step + 1] === 'finish' || stepStatus[step + 1] === 'process') {
      setSelectedStep(step)
    }
  }

  if (!query) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px', textAlign: 'center' }}>
          <Alert
            message="No query provided"
            description="Please enter a search query to generate a newsletter."
            type="warning"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/')}>
                Go Home
              </Button>
            }
          />
        </Content>
      </Layout>
    )
  }

  return (
    <Layout className="results-layout">
      <Header className="results-header">
        <div className="header-content">
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            className="home-button"
          />
          <h2 className="header-title gradient-text">AI Newsletter Studio</h2>
          <div className="header-search">
            <Search
              placeholder="Search another topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
            />
          </div>
        </div>
      </Header>

      <Content className="results-content">
        <div className="results-container">
          <div className="query-badge">
            Generating newsletter for: <strong>{query}</strong>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              action={
                <Button size="small" onClick={retry}>
                  Retry
                </Button>
              }
            />
          )}

          <Steps
            current={selectedStep}
            items={STEPS.map((step, index) => ({
              title: step.title,
              description: step.description,
              status: stepStatus[index + 1],
            }))}
            onChange={handleStepClick}
            style={{ marginBottom: 40 }}
          />

          <div className="step-content-wrapper">
            <StepContent
              step={selectedStep + 1}
              data={stepData[selectedStep + 1]}
              status={stepStatus[selectedStep + 1]}
            />
          </div>

          {completed && (
            <div className="completion-message">
              <Alert
                message="Newsletter Generated Successfully!"
                description="Your newsletter is ready. You can copy it, download it, or generate another one."
                type="success"
                showIcon
                style={{ marginTop: 24 }}
                action={
                  <Space>
                    <Button type="primary" onClick={() => navigate('/')}>
                      Generate Another
                    </Button>
                  </Space>
                }
              />
            </div>
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default Results
