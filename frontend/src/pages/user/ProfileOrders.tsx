import { useState } from 'react'
import { Card, Tabs, Empty, Typography, Tag, Button, Space, Row, Col } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

type TabKey = 'all' | 'unpaid' | 'unsent' | 'unreceived' | 'unreviewed' | 'refund'

const ProfileOrders = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const tabItems = [
    { key: 'all', label: '全部订单' },
    { key: 'unpaid', label: '待付款' },
    { key: 'unsent', label: '待发货' },
    { key: 'unreceived', label: '待收货' },
    { key: 'unreviewed', label: '待评价' },
    { key: 'refund', label: '退换/售后' },
  ]

  return (
    <div>
      <Title level={4} style={{ marginTop: 0, marginBottom: 20 }}>
        <ShoppingOutlined style={{ marginRight: 8 }} />
        我的订单
      </Title>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={tabItems}
        />

        <Empty
          description={
            <div>
              <Text type="secondary">暂无订单</Text>
              <br />
              <Button type="primary" style={{ marginTop: 16 }} href="/goods">
                去购物
              </Button>
            </div>
          }
        />
      </Card>
    </div>
  )
}

export default ProfileOrders
