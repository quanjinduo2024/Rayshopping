import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tabs, Empty, Typography, Tag, Space, Button } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { Order } from '@/types/order'

const { Title, Text } = Typography

type TabKey = 'all' | 'unpaid' | 'unsent' | 'unreceived' | 'unreviewed' | 'refund'

const ProfileOrders = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const statusFromUrl = searchParams.get('status') as TabKey | null

  const [activeTab, setActiveTab] = useState<TabKey>(statusFromUrl || 'all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await shopService.getOrderList()
      // 转换 total_price 为数字类型
      const ordersWithNumericPrice = (response.items || []).map((order: Order) => ({
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

  // 当 URL 参数变化时更新 activeTab
  useEffect(() => {
    if (statusFromUrl) {
      setActiveTab(statusFromUrl)
    }
  }, [statusFromUrl])

  const handleTabChange = useCallback(
    (key: string) => {
      const newTab = key as TabKey
      setActiveTab(newTab)
      // 更新 URL 参数但不刷新页面
      navigate('/profile?tab=orders&status=' + newTab, { replace: true })
    },
    [navigate]
  )

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

  // 按状态过滤订单
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'all':
        return orders
      case 'unpaid':
        return orders.filter((order) => order.status === 'pending_payment')
      case 'unsent':
        return orders.filter((order) => order.status === 'pending_shipment')
      case 'unreceived':
        return orders.filter((order) => order.status === 'pending_receipt')
      case 'unreviewed':
        // 待评价：已完成但未评价的订单（这里简化处理，所有已完成都算作待评价）
        return orders.filter((order) => order.status === 'completed')
      case 'refund':
        return orders.filter((order) => order.status === 'refunded')
      default:
        return orders
    }
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
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
