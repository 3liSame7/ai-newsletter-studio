import { Card, Typography, Space, Tag } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

const { Paragraph, Text, Link } = Typography

function SearchResultCard({ result }) {
  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      onClick={() => window.open(result.link, '_blank')}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Link href={result.link} target="_blank" onClick={(e) => e.stopPropagation()}>
          <LinkOutlined /> {result.title || 'Untitled'}
        </Link>
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 8, color: '#5f6368' }}
        >
          {result.snippet || result.description || 'No description available'}
        </Paragraph>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {result.link}
        </Text>
      </Space>
    </Card>
  )
}

export default SearchResultCard
