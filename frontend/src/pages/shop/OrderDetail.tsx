import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Typography, Spin, message, Button, Card, Tag, Space, Divider, Steps, Row, Col } from 'antd'
import { ShoppingOutlined, EnvironmentOutlined, CheckCircleOutlined, CreditCardOutlined, SendOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { OrderDetail as OrderDetailType } from '@/types/order'

const { Title, Text, Paragraph } = Typography
const { Step } = Steps

type OrderStatus = 'pending_payment' | 'pending_shipment' | 'pending_receipt' | 'completed' | 'cancelled' | 'refunded'

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchOrderDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await shopService.getOrderDetail(parseInt(id))
      const orderData = {
        ...data,
        total_price: Number(data.total_price),
        items: data.items.map((item: any) => ({
          ...item,
          price: Number(item.price),
        })),
      }
      setOrder(orderData)
    } catch (err) {
      message.error('获取订单详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusText = (status: OrderStatus) => {
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

  const getOrderSteps = (status: OrderStatus) => {
    const allSteps = [
      { title: '提交订单', icon: <CheckCircleOutlined /> },
      { title: '付款成功', icon: <CreditCardOutlined /> },
      { title: '商品已发货', icon: <SendOutlined /> },
      { title: '已签收', icon: <CheckCircleOutlined /> },
    ]

    let current = -1
    if (status === 'pending_payment') current = 0
    else if (status === 'pending_shipment') current = 1
    else if (status === 'pending_receipt') current = 2
    else if (status === 'completed') current = 3
    else if (status === 'cancelled' || status === 'refunded') current = 0

    return { steps: allSteps, current }
  }

  const canPay = (status: OrderStatus) => status === 'pending_payment'
  const canReceive = (status: OrderStatus) => status === 'pending_receipt'
  const canCancel = (status: OrderStatus) => ['pending_payment', 'pending_shipment'].includes(status)

  const handlePay = async () => {
    if (!order) return
    setActionLoading(true)
    try {
      await shopService.payOrder(order.order_id)
      message.success('付款成功！')
      fetchOrderDetail()
    } catch (err) {
      message.error('付款失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReceive = async () => {
    if (!order) return
    setActionLoading(true)
    try {
      await shopService.receiveOrder(order.order_id)
      message.success('确认收货成功！')
      fetchOrderDetail()
    } catch (err) {
      message.error('确认收货失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!order) return
    setActionLoading(true)
    try {
      await shopService.cancelOrder(order.order_id)
      message.success('订单已取消')
      fetchOrderDetail()
    } catch (err) {
      message.error('取消订单失败')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', background: '#f5f5f5' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ padding: '100px 50px', textAlign: 'center' }}>
        <Title level={4}>订单不存在</Title>
        <Link to="/orders">
          <Button type="primary">返回订单列表</Button>
        </Link>
      </div>
    )
  }

  const { steps, current } = getOrderSteps(order.status as OrderStatus)

  return (
    <div className="jd-page-content" style={{ padding: '20px 50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={2}>订单详情</Title>
        <Space>
          <Link to="/orders">
            <Button>返回订单列表</Button>
          </Link>
          <Button type="primary" onClick={() => navigate('/goods')}>
            继续购物
          </Button>
        </Space>
      </div>

      <Row gutter={20}>
        <Col xs={24} md={16}>
          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              订单状态
            </Title>
            <Steps current={current} items={steps} style={{ padding: '20px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <div>
                <Text type="secondary">订单号：</Text>
                <Text strong>{order.order_id}</Text>
              </div>
              <Space>
                <Tag color={getStatusColor(order.status as OrderStatus)} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {getStatusText(order.status as OrderStatus)}
                </Tag>
                {canPay(order.status as OrderStatus) && (
                  <Button
                    type="primary"
                    icon={<CreditCardOutlined />}
                    loading={actionLoading}
                    onClick={handlePay}
                  >
                    立即付款
                  </Button>
                )}
                {canReceive(order.status as OrderStatus) && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    loading={actionLoading}
                    onClick={handleReceive}
                  >
                    确认收货
                  </Button>
                )}
                {canCancel(order.status as OrderStatus) && (
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    loading={actionLoading}
                    onClick={handleCancel}
                  >
                    取消订单
                  </Button>
                )}
              </Space>
            </div>
          </div>

          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              收货信息
            </Title>
            {order.address_name ? (
              <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: 4 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>{order.address_name}</Text>
                  <Text style={{ marginLeft: 20 }}>{order.address_phone}</Text>
                </div>
                <Text type="secondary">
                  {order.address_province} {order.address_city} {order.address_district} {order.address_detail}
                </Text>
              </div>
            ) : (
              <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: 4 }}>
                <Text type="secondary">暂无收货信息</Text>
              </div>
            )}
          </div>

          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              <ShoppingOutlined style={{ marginRight: 8 }} />
              商品清单
            </Title>

            <div style={{ display: 'flex', padding: '10px 0', borderBottom: '2px solid #e8e8e8' }}>
              <div style={{ flex: 1 }}>商品</div>
              <div style={{ width: 100, textAlign: 'center' }}>单价</div>
              <div style={{ width: 80, textAlign: 'center' }}>数量</div>
              <div style={{ width: 100, textAlign: 'center' }}>小计</div>
            </div>

            {order.items.map((item) => (
              <div key={item.item_id} className="jd-checkout-item">
                <div className="jd-checkout-image">
                  <ShoppingOutlined style={{ fontSize: 24, color: '#999' }} />
                </div>
                <div className="jd-checkout-name">{item.goods_name || `商品 #${item.goods_id}`}</div>
                <div style={{ width: 100, textAlign: 'center' }}>
                  ¥{item.price.toFixed(2)}
                </div>
                <div style={{ width: 80, textAlign: 'center' }}>
                  x{item.quantity}
                </div>
                <div style={{ width: 100, textAlign: 'center', color: '#e4393c', fontWeight: 'bold' }}>
                  ¥{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              订单信息
            </Title>

            <div className="jd-checkout-summary">
              <div className="jd-summary-row">
                <span className="jd-summary-label">下单时间</span>
                <span className="jd-summary-value">
                  {new Date(order.create_time).toLocaleString()}
                </span>
              </div>
              <div className="jd-summary-row">
                <span className="jd-summary-label">商品金额</span>
                <span className="jd-summary-value">¥{order.total_price.toFixed(2)}</span>
              </div>
              <div className="jd-summary-row">
                <span className="jd-summary-label">运费</span>
                <span className="jd-summary-value">
                  <Tag color="green">免运费</Tag>
                </span>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div className="jd-summary-row total">
                <span className="jd-summary-label">应付总额</span>
                <span className="jd-summary-value">¥{order.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              服务保障
            </Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>正品保障</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text>7天无理由退货</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
                <Text>极速配送</Text>
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default OrderDetail
