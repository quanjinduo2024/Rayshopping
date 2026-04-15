import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Tabs, Empty, Typography, Tag, Space, Button } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { Order } from '@/types/order'

const { Title, Text } = Typography

type TabKey = 'all' | 'unpaid' | 'unsent' | 'unreceived' | 'unreviewed' | 'refund'

const ProfileOrders = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('all')
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
      case 'pending_payment':
        return 'orange'
      case 'pending_shipment':
        return 'blue'
      case 'pending_receipt':
        return 'cyan'
      case 'completed':
        return 'green'
      case 'cancelled':
      case 'refunded':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return '待付款'
      case 'pending_shipment':
        return '待发货'
      case 'pending_receipt':
        return '待收货'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      case 'refunded':
        return '已退款'
      default:
        return status
    }
  }

  const handleBuyAgain = () => {
    navigate('/goods')
  }

  const tabItems = [
    { key: 'all', label: '全部订单' },
    { key: 'unpaid', label: '待付款' },
    { key: 'unsent', label: '待发货' },
    { key: 'unreceived', label: '待收货' },
    { key: 'unreviewed', label: '待评价' },
    { key: 'refund', label: '退换/售后' },
  ]

  // 简单过滤（暂时前端过滤，后续后端支持）
  const filteredOrders = orders

  return (
    <div>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={tabItems}
        />

        {filteredOrders.length === 0 ? (
          <Empty
            description={
              <div>
                <Text type="secondary">暂无订单</Text>
                <br />
                <Button type="primary" style={{ marginTop: 16 }} onClick={handleBuyAgain}>
                  去购物
                </Button>
              </div>
            }
          />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {filteredOrders.map((order) => (
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
                      <ShoppingOutlined style={{ fontSize: 24, color: '#999' }} />
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
      </Card>
    </div>
  )
}

export default ProfileOrders
