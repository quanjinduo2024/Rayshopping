import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Typography, Button, message, Spin, Radio, Space, Divider, Tag, Empty, Row, Col } from 'antd'
import { ShoppingOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { shopService } from '@/services/shopService'
import type { CartItem } from '@/types/cart'

const { Title, Text, Paragraph } = Typography

interface Address {
  id: number
  name: string
  phone: string
  address: string
  isDefault: boolean
}

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAddress, setSelectedAddress] = useState<number>(1)

  // 模拟收货地址数据
  const addresses: Address[] = [
    {
      id: 1,
      name: '张三',
      phone: '138****8888',
      address: '北京市朝阳区建国路88号SOHO现代城A座1001室',
      isDefault: true,
    },
    {
      id: 2,
      name: '李四',
      phone: '139****9999',
      address: '上海市浦东新区陆家嘴环路1000号恒生银行大厦',
      isDefault: false,
    },
  ]

  const fetchCartData = async () => {
    if (!userId) {
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      const response = await shopService.getCartList()
      // 只显示已选中的商品
      const checkedItems = response.items.filter((item: CartItem) => item.checked)
      if (checkedItems.length === 0) {
        message.warning('请先选择要结算的商品')
        navigate('/cart')
        return
      }
      setCartItems(checkedItems)
    } catch (err) {
      message.error('获取购物车数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartData()
  }, [userId])

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      message.warning('没有可结算的商品')
      return
    }
    setSubmitLoading(true)
    try {
      const order = await shopService.checkoutCart({
        cart_ids: cartItems.map((item) => item.cart_id),
      })
      message.success('订单提交成功！')
      navigate(`/orders/${order.order_id}`)
    } catch (err) {
      message.error('订单提交失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const shippingFee = totalPrice >= 99 ? 0 : 8
  const finalPrice = totalPrice + shippingFee

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', background: '#f5f5f5' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '100px 50px' }}>
        <Empty description="没有可结算的商品">
          <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate('/cart')}>
            返回购物车
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="jd-page-content" style={{ padding: '20px 50px' }}>
      <Title level={2} style={{ marginBottom: 20 }}>
        结算页
      </Title>

      <Row gutter={20}>
        <Col xs={24} md={16}>
          {/* 收货地址 */}
          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              收货地址
            </Title>
            <Radio.Group
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {addresses.map((addr) => (
                  <Radio key={addr.id} value={addr.id}>
                    <div
                      className={`jd-address-item ${selectedAddress === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(addr.id)}
                    >
                      <div>
                        <span className="jd-address-name">{addr.name}</span>
                        <span className="jd-address-phone">{addr.phone}</span>
                        {addr.isDefault && <Tag color="blue" style={{ marginLeft: 8 }}>默认</Tag>}
                      </div>
                      <div className="jd-address-detail">{addr.address}</div>
                    </div>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
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
              <div className="jd-checkout-price">单价</div>
              <div className="jd-checkout-quantity">数量</div>
              <div className="jd-checkout-total">小计</div>
            </div>

            {/* 商品列表 */}
            {cartItems.map((item) => (
              <div key={item.cart_id} className="jd-checkout-item">
                <div className="jd-checkout-image">
                  <ShoppingOutlined style={{ fontSize: 24, color: '#999' }} />
                </div>
                <div className="jd-checkout-name">{item.goods_name || `商品 #${item.goods_id}`}</div>
                <div className="jd-checkout-price">¥{item.price?.toFixed(2) || '0.00'}</div>
                <div className="jd-checkout-quantity">x{item.quantity}</div>
                <div className="jd-checkout-total">
                  ¥{((item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col xs={24} md={8}>
          {/* 订单摘要 */}
          <div className="jd-checkout-section">
            <Title level={4} className="jd-checkout-title">
              订单摘要
            </Title>

            <div className="jd-checkout-summary">
              <div className="jd-summary-row">
                <span className="jd-summary-label">商品金额</span>
                <span className="jd-summary-value">¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="jd-summary-row">
                <span className="jd-summary-label">运费</span>
                <span className="jd-summary-value">
                  {shippingFee === 0 ? (
                    <Tag color="green">免运费</Tag>
                  ) : (
                    `¥${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {shippingFee > 0 && (
                <div style={{ color: '#999', fontSize: 12, marginBottom: 10 }}>
                  （满99元免运费）
                </div>
              )}
              <Divider style={{ margin: '10px 0' }} />
              <div className="jd-summary-row total">
                <span className="jd-summary-label">应付总额</span>
                <span className="jd-summary-value">¥{finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* 底部提交订单栏 */}
      <div className="jd-checkout-footer">
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <Text>正品保障 · 7天无理由退货 · 极速配送</Text>
        </Space>
        <Space style={{ marginLeft: 'auto' }}>
          <div style={{ textAlign: 'right' }}>
            <Text type="secondary">应付总额：</Text>
            <Text style={{ fontSize: 20, color: '#ff4d4f', fontWeight: 'bold', marginRight: 20 }}>
              ¥{finalPrice.toFixed(2)}
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            loading={submitLoading}
            className="jd-btn-submit-order"
            onClick={handleSubmitOrder}
          >
            提交订单
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Checkout
