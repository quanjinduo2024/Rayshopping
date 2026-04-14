import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Descriptions, List, Typography, Spin, Tag, message } from 'antd'
import { shopService } from '@/services/shopService'
import type { OrderDetail } from '@/types/order'

const { Title } = Typography

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchOrderDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await shopService.getOrderDetail(parseInt(id))
      setOrder(data)
    } catch (err) {
      message.error('获取订单详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!order) {
    return <div>订单不存在</div>
  }

  return (
    <div>
      <Title level={2}>订单详情</Title>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="订单号">{order.order_id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">
            {new Date(order.create_time).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            <span style={{ color: '#f5222d', fontSize: 18, fontWeight: 'bold' }}>
              ¥{order.total_price.toFixed(2)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="商品清单">
        <List
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.goods_name || `商品 #${item.goods_id}`}
                description={`数量：${item.quantity}`}
              />
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 16 }}>
                  ¥{item.price.toFixed(2)} × {item.quantity}
                </span>
                <span style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>
                  ¥{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default OrderDetail
