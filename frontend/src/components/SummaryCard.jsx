import { Card, Typography } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

function SummaryCard({ summary }) {
  return (
    <Card
      style={{ background: '#f9f9f9', border: '1px solid #e0e0e0' }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: 16 }}>
        <FileTextOutlined style={{ fontSize: 32, color: '#4285f4', marginTop: 4 }} />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>
            Article Summary
          </Title>
          <Paragraph style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {summary}
          </Paragraph>
        </div>
      </div>
    </Card>
  )
}

export default SummaryCard
