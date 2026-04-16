import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Typography, Spin, message, Button, Card, Tag, Space, Divider, Steps, Row, Col, Avatar } from 'antd'
import { ShoppingOutlined, EnvironmentOutlined, CheckCircleOutlined, SendOutlined, CreditCardOutlined, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { OrderDetail as OrderDetailType } from '../types'

const { Title, Text } = Typography
const { Step } = Steps

type OrderStatus = 'pending_payment' | 'pending_shipment' | 'pending_receipt' | 'completed' | 'cancelled' | 'refunded'

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const [shipLoading, setShipLoading] = useState(false)

  const fetchOrderDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await adminService.getOrderDetail(parseInt(id))
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

  const canShip = (status: OrderStatus) => status === 'pending_shipment'

  const handleShip = async () => {
    if (!order) return
    setShipLoading(true)
    try {
      await adminService.shipOrder(order.order_id)
      message.success('发货成功')
      fetchOrderDetail()
    } catch (err) {
      message.error('发货失败')
    } finally {
      setShipLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', background: '#FAF9F8' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ padding: '100px 50px', background: '#FAF9F8' }}>
        <Title level={4}>订单不存在</Title>
        <Link to="/orders">
          <Button type="primary" style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px', marginTop: '16px' }}>
            返回订单列表
          </Button>
        </Link>
      </div>
    )
  }

  const { steps, current } = getOrderSteps(order.status as OrderStatus)

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/orders')}
            style={{ borderRadius: '12px' }}
          >
            返回订单列表
          </Button>
          <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600' }}>
            订单详情
          </Title>
        </Space>
        <Space>
          {canShip(order.status as OrderStatus) && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={shipLoading}
              onClick={handleShip}
              style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px' }}
            >
              发货
            </Button>
          )}
        </Space>
      </div>

      <Row gutter={20}>
        <Col xs={24} md={16}>
          <Card title="订单状态" style={{ marginBottom: 20, borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <Steps current={current} items={steps} style={{ padding: '20px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <div>
                <Text type="secondary" style={{ color: '#8C8A87' }}>订单号：</Text>
                <Text strong style={{ color: '#2C2A28' }}>{order.order_id}</Text>
              </div>
              <Tag color={getStatusColor(order.status as OrderStatus)} style={{ fontSize: 14, padding: '4px 12px', borderRadius: '10px' }}>
                {getStatusText(order.status as OrderStatus)}
              </Tag>
            </div>
          </Card>

          <Card title="用户信息" style={{ marginBottom: 20, borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
              <Avatar
                size={64}
                src={order.user_info?.avatar}
                icon={<UserOutlined />}
                style={{ marginRight: 16 }}
              />
              <div>
                <div style={{ marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 16, color: '#2C2A28', fontWeight: '600' }}>
                    {order.user_info?.username || `用户 #${order.user_id}`}
                  </Text>
                </div>
                {order.user_info?.phone && (
                  <div>
                    <Text type="secondary" style={{ color: '#8C8A87' }}>手机号：</Text>
                    <Text style={{ color: '#5E5B57' }}>{order.user_info.phone}</Text>
                  </div>
                )}
                <div>
                  <Text type="secondary" style={{ color: '#8C8A87' }}>用户ID：</Text>
                  <Text style={{ color: '#5E5B57' }}>{order.user_id}</Text>
                </div>
              </div>
            </div>
          </Card>

          <Card title="收货信息" style={{ marginBottom: 20, borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            {order.address_name ? (
              <div style={{ padding: '15px', background: '#FAF9F8', borderRadius: '12px' }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: '#2C2A28' }}>{order.address_name}</Text>
                  <Text style={{ marginLeft: 20, color: '#5E5B57' }}>{order.address_phone}</Text>
                </div>
                <Text type="secondary" style={{ color: '#8C8A87' }}>
                  {order.address_province} {order.address_city} {order.address_district} {order.address_detail}
                </Text>
              </div>
            ) : (
              <div style={{ padding: '15px', background: '#FAF9F8', borderRadius: '12px' }}>
                <Text type="secondary" style={{ color: '#8C8A87' }}>暂无收货信息</Text>
              </div>
            )}
          </Card>

          <Card title="商品清单" style={{ borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <div style={{ display: 'flex', padding: '10px 0', borderBottom: '2px solid #EFEDEA' }}>
              <div style={{ flex: 1 }}>商品</div>
              <div style={{ width: 100, textAlign: 'center' }}>单价</div>
              <div style={{ width: 80, textAlign: 'center' }}>数量</div>
              <div style={{ width: 100, textAlign: 'center' }}>小计</div>
            </div>

            {order.items.map((item) => (
              <div key={item.item_id} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #FAF9F8', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 60, height: 60, background: '#FAF9F8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <ShoppingOutlined style={{ fontSize: 24, color: '#C8C6C3' }} />
                  </div>
                  <span style={{ color: '#2C2A28' }}>{item.goods_name || `商品 #${item.goods_id}`}</span>
                </div>
                <div style={{ width: 100, textAlign: 'center', color: '#5E5B57' }}>
                  ¥{item.price.toFixed(2)}
                </div>
                <div style={{ width: 80, textAlign: 'center', color: '#5E5B57' }}>
                  x{item.quantity}
                </div>
                <div style={{ width: 100, textAlign: 'center', color: '#D97A4A', fontWeight: 'bold' }}>
                  ¥{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="订单信息" style={{ borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>下单时间：</Text>
              <Text style={{ color: '#5E5B57' }}>{new Date(order.create_time).toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>商品金额：</Text>
              <Text style={{ color: '#5E5B57' }}>¥{order.total_price.toFixed(2)}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>运费：</Text>
              <Tag color="green" style={{ borderRadius: '10px' }}>免运费</Tag>
            </div>
            <Divider style={{ margin: '10px 0', borderColor: '#EFEDEA' }} />
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>应付总额：</Text>
              <Text style={{ fontSize: 20, color: '#D97A4A', fontWeight: 'bold' }}>
                ¥{order.total_price.toFixed(2)}
              </Text>
            </div>
          </Card>

          <Card title="服务保障" style={{ marginTop: 20, borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text style={{ color: '#5E5B57' }}>正品保障</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text style={{ color: '#5E5B57' }}>7天无理由退货</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: '#D97A4A', marginRight: 8 }} />
                <Text style={{ color: '#5E5B57' }}>极速配送</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderDetail
