import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Typography, Spin, message, Button, Card, Tag, Space, Divider, Steps, Row, Col } from 'antd'
import { ShoppingOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { OrderDetail as OrderDetailType } from '@/types/order'

const { Title, Text, Paragraph } = Typography
const { Step } = Steps

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailType | null>(null)
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

  const getOrderSteps = (status: string) => {
    const allSteps = [
      { title: '提交订单', icon: <CheckCircleOutlined /> },
      { title: '商品出库', icon: <ShoppingOutlined /> },
      { title: '配送中', icon: <EnvironmentOutlined /> },
      { title: '已签收', icon: <CheckCircleOutlined /> },
    ]
    // 简化：completed 显示全部完成，pending 显示第一步完成
    const current = status === 'completed' ? 3 : 0
    return { steps: allSteps, current }
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

  const { steps, current } = getOrderSteps(order.status)

  return (
    <div className="jd-page-content" style={{ padding: '20px 50px' }}>
      {/* 订单标题栏 */}
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
          {/* 订单状态跟踪 */}
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
              <Tag color={getStatusColor(order.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
                {getStatusText(order.status)}
              </Tag>
            </div>
          </div>

          {/* 收货地址 */}
          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              收货信息
            </Title>
            <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: 4 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>张三</Text>
                <Text style={{ marginLeft: 20 }}>138****8888</Text>
              </div>
              <Text type="secondary">北京市朝阳区建国路88号SOHO现代城A座1001室</Text>
            </div>
          </div>

          {/* 商品清单 */}
          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              <ShoppingOutlined style={{ marginRight: 8 }} />
              商品清单
            </Title>

            {/* 表头 */}
            <div style={{ display: 'flex', padding: '10px 0', borderBottom: '2px solid #e8e8e8' }}>
              <div style={{ flex: 1 }}>商品</div>
              <div style={{ width: 100, textAlign: 'center' }}>单价</div>
              <div style={{ width: 80, textAlign: 'center' }}>数量</div>
              <div style={{ width: 100, textAlign: 'center' }}>小计</div>
            </div>

            {/* 商品列表 */}
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
          {/* 订单摘要 */}
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

          {/* 服务保障 */}
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
