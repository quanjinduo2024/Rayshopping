import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, List, Typography, Tag, Spin, Empty, Button } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { Order } from '@/types/order'

const { Title, Text } = Typography

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await shopService.getOrderList()
      setOrders(response.items)
    } catch (err) {
      console.error('获取订单列表失败', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange'
      case 'completed':
        return 'green'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'completed':
        return '已完成'
      default:
        return status
    }
  }

  return (
    <div>
      <Title level={2}>我的订单</Title>
      <Spin spinning={loading}>
        {orders.length === 0 ? (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无订单"
            >
              <Link to="/goods">
                <Button type="primary" icon={<ShoppingOutlined />}>
                  去购物
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <List
            dataSource={orders}
            renderItem={(order) => (
              <List.Item>
                <Card style={{ width: '100%' }}>
                  <List.Item.Meta
                    title={
                      <Link to={`/orders/${order.order_id}`}>
                        订单 #{order.order_id}
                      </Link>
                    }
                    description={
                      <div>
                        <Text type="secondary">
                          下单时间：{new Date(order.create_time).toLocaleString()}
                        </Text>
                      </div>
                    }
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ fontSize: 18, marginRight: 16 }}>
                      ¥{order.total_price.toFixed(2)}
                    </Text>
                    <Tag color={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Tag>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </div>
  )
}

export default OrderList
