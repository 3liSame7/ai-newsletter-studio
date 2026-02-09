import { Empty, Spin, Typography } from 'antd'
import SearchResultCard from './SearchResultCard'
import URLCard from './URLCard'
import SummaryCard from './SummaryCard'
import NewsletterPreview from './NewsletterPreview'

const { Title } = Typography

function StepContent({ step, data, status }) {
  if (status === 'wait') {
    return (
      <Empty
        description="This step hasn't started yet"
        style={{ padding: '60px 20px' }}
      />
    )
  }

  if (status === 'process' && !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 20, color: '#666' }}>
          Processing...
        </Title>
      </div>
    )
  }

  // Step 1: Search Results
  if (step === 1 && data) {
    const results = data.organic || data.results || []
    return (
      <div>
        <Title level={4} style={{ marginBottom: 20 }}>
          Search Results ({results.length} found)
        </Title>
        {results.map((result, index) => (
          <SearchResultCard key={index} result={result} />
        ))}
      </div>
    )
  }

  // Step 2: Best URLs
  if (step === 2 && data) {
    const urls = Array.isArray(data) ? data : []
    return (
      <div>
        <Title level={4} style={{ marginBottom: 20 }}>
          Top {urls.length} Articles Selected
        </Title>
        {urls.map((url, index) => (
          <URLCard key={index} url={url} index={index} />
        ))}
      </div>
    )
  }

  // Step 3: Summary
  if (step === 3 && data) {
    return <SummaryCard summary={data} />
  }

  // Step 4: Newsletter
  if (step === 4 && data) {
    return <NewsletterPreview newsletter={data} />
  }

  return (
    <Empty
      description="No data available"
      style={{ padding: '60px 20px' }}
    />
  )
}

export default StepContent
