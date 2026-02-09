import { Card, Typography, Button, Space, message } from 'antd'
import { MailOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

function NewsletterPreview({ newsletter }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(newsletter)
    message.success('Newsletter copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([newsletter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter.txt'
    a.click()
    URL.revokeObjectURL(url)
    message.success('Newsletter downloaded!')
  }

  return (
    <Card
      className="newsletter-preview-card"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: 16, marginBottom: 20 }}>
        <MailOutlined style={{ fontSize: 32, color: 'white' }} />
        <div style={{ flex: 1 }}>
          <Title level={3} style={{ color: 'white', marginTop: 0, marginBottom: 8 }}>
            Your Newsletter is Ready! 🎉
          </Title>
          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
            Here's your professionally generated newsletter
          </Paragraph>
        </div>
      </div>

      <div
        className="newsletter-content"
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Paragraph
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: '#333',
            whiteSpace: 'pre-wrap',
            marginBottom: 0,
          }}
        >
          {newsletter}
        </Paragraph>
      </div>

      <Space>
        <Button
          icon={<CopyOutlined />}
          onClick={handleCopy}
          size="large"
          style={{ background: 'white', color: '#667eea', borderColor: 'white' }}
        >
          Copy to Clipboard
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          size="large"
          style={{ background: 'transparent', color: 'white', borderColor: 'white' }}
        >
          Download
        </Button>
      </Space>
    </Card>
  )
}

export default NewsletterPreview
