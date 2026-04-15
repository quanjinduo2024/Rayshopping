import { Card, Empty, Typography, Button, Row, Col } from 'antd'
import { HeartOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ProfileFavorites = () => {
  return (
    <div>
      <Title level={4} style={{ marginTop: 0, marginBottom: 20 }}>
        <HeartOutlined style={{ marginRight: 8 }} />
        我的收藏
      </Title>

      <Card>
        <Empty
          description={
            <div>
              <Text type="secondary">暂无收藏商品</Text>
              <br />
              <Button type="primary" style={{ marginTop: 16 }} href="/goods">
                去逛逛
              </Button>
            </div>
          }
        />
      </Card>
    </div>
  )
}

export default ProfileFavorites
