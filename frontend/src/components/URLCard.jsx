import { Card, Typography, Button } from 'antd'
import { LinkOutlined, CheckCircleFilled } from '@ant-design/icons'

const { Text } = Typography

function URLCard({ url, index }) {
  return (
    <Card
      style={{
        marginBottom: 16,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CheckCircleFilled style={{ fontSize: 24, color: '#52c41a' }} />
        <div style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 14, display: 'block', marginBottom: 8 }}>
            Article #{index + 1}
          </Text>
          <Text
            ellipsis
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: 13,
              display: 'block',
            }}
          >
            {url}
          </Text>
        </div>
        <Button
          type="primary"
          ghost
          icon={<LinkOutlined />}
          onClick={() => window.open(url, '_blank')}
          style={{ borderColor: 'white', color: 'white' }}
        >
          Open
        </Button>
      </div>
    </Card>
  )
}

export default URLCard
