import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Typography, Spin, Empty, Button, Tag, Space, Divider } from 'antd'
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { Order } from '@/types/order'

const { Title, Text } = Typography

const OrderList = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await shopService.getOrderList()
      // 转换 total_price 为数字类型
      const ordersWithNumericPrice = response.items.map((order: Order) => ({
        ...order,
        total_price: Number(order.total_price),
      }))
      setOrders(ordersWithNumericPrice)
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

  const handleBuyAgain = () => {
    navigate('/goods')
  }

  return (
    <div className="jd-page-content" style={{ padding: '20px 50px' }}>
      <Title level={2} style={{ marginBottom: 20 }}>
        我的订单
      </Title>

      <Spin spinning={loading}>
        {orders.length === 0 ? (
          <div style={{ background: '#fff', padding: '80px 0', textAlign: 'center' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无订单"
            >
              <Link to="/goods">
                <Button type="primary" size="large" icon={<ShoppingOutlined />}>
                  去购物
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {orders.map((order) => (
              <div key={order.order_id} className="jd-order-card">
                {/* 订单头部 */}
                <div className="jd-order-header">
                  <div className="jd-order-info">
                    <span className="jd-order-id">订单号：{order.order_id}</span>
                    <span className="jd-order-time">
                      {new Date(order.create_time).toLocaleString()}
                    </span>
                  </div>
                  <Tag color={getStatusColor(order.status)} className="jd-order-status">
                    {getStatusText(order.status)}
                  </Tag>
                </div>

                {/* 订单商品（简略展示） */}
                <div className="jd-order-body">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="jd-order-image">
                      <ShoppingCartOutlined style={{ fontSize: 24, color: '#999' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text type="secondary">共 1 件商品</Text>
                    </div>
                  </div>
                </div>

                {/* 订单底部 */}
                <div className="jd-order-footer">
                  <div>
                    <span className="jd-order-total-label">订单金额：</span>
                    <span className="jd-order-total">¥{order.total_price.toFixed(2)}</span>
                  </div>
                  <div className="jd-order-actions">
                    <Link to={`/orders/${order.order_id}`}>
                      <Button type="primary" size="small">
                        查看详情
                      </Button>
                    </Link>
                    <Button size="small" onClick={handleBuyAgain}>
                      再次购买
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Space>
        )}
      </Spin>
    </div>
  )
}

export default OrderList
