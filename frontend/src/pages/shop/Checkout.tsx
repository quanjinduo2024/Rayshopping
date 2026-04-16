import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Typography, Button, message, Spin, Radio, Space, Divider, Tag, Empty, Row, Col, Modal, Form, Input, Cascader, Checkbox } from 'antd'
import { ShoppingOutlined, EnvironmentOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { shopService } from '@/services/shopService'
import { userService } from '@/services/userService'
import type { CartItem } from '@/types/cart'
import type { Address, AddressRequest } from '@/types/user'
import regionData from '@/utils/regionData'

const { Title, Text, Paragraph } = Typography

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userId } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addressList, setAddressList] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)

  // 添加地址模态框
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addForm] = Form.useForm()
  const [addLoading, setAddLoading] = useState(false)

  // 获取购物车数据
  const fetchCartData = async () => {
    if (!userId) {
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      const response = await shopService.getCartList()
      // 只显示已选中的商品，并转换 price 为数字
      const checkedItems = response.items
        .filter((item: CartItem) => item.checked)
        .map((item: CartItem) => ({
          ...item,
          price: item.price ? Number(item.price) : 0,
        }))
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

  // 获取地址列表
  const fetchAddressList = async () => {
    if (!userId) return
    setAddressLoading(true)
    try {
      const list = await userService.getAddressList()
      setAddressList(list)
      // 默认选中第一个地址或默认地址
      if (list.length > 0) {
        const defaultAddress = list.find((addr) => addr.is_default)
        setSelectedAddressId(defaultAddress ? defaultAddress.address_id : list[0].address_id)
      } else {
        setSelectedAddressId(null)
      }
    } catch (error) {
      message.error('获取地址列表失败')
    } finally {
      setAddressLoading(false)
    }
  }

  useEffect(() => {
    fetchCartData()
    fetchAddressList()
  }, [userId])

  // 处理添加地址
  const handleAddAddress = () => {
    addForm.resetFields()
    setIsAddModalOpen(true)
  }

  const handleAddModalOk = async () => {
    try {
      const values = await addForm.validateFields()
      setAddLoading(true)

      // 处理省市区数据
      const [province, city, district] = values.region || []
      const addressData: AddressRequest = {
        name: values.name,
        phone: values.phone,
        province,
        city,
        district,
        detail: values.detail,
        is_default: values.is_default || addressList.length === 0, // 如果是第一个地址，设为默认
      }

      await userService.addAddress(addressData)
      message.success('添加地址成功')

      setIsAddModalOpen(false)
      addForm.resetFields()
      await fetchAddressList()
    } catch (error) {
      message.error('添加地址失败')
    } finally {
      setAddLoading(false)
    }
  }

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      message.warning('没有可结算的商品')
      return
    }
    if (!selectedAddressId) {
      message.warning('请选择收货地址')
      return
    }
    setSubmitLoading(true)
    try {
      const order = await shopService.checkoutCart({
        cart_ids: cartItems.map((item) => item.cart_id),
        address_id: selectedAddressId,
      })
      message.success('订单提交成功！')
      navigate(`/orders/${order.order_id}`)
    } catch (err) {
      message.error('订单提交失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  // 格式化完整地址
  const getFullAddress = (addr: Address) => {
    return `${addr.province} ${addr.city} ${addr.district} ${addr.detail}`
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} className="jd-checkout-title" style={{ margin: 0 }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                收货地址
              </Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAddress}>
                新增地址
              </Button>
            </div>

            <Spin spinning={addressLoading}>
              {addressList.length === 0 ? (
                <Card>
                  <Empty
                    description={
                      <div>
                        <Text type="secondary">暂无收货地址，请先添加</Text>
                        <br />
                        <Button type="primary" style={{ marginTop: 16 }} onClick={handleAddAddress}>
                          添加地址
                        </Button>
                      </div>
                    }
                  />
                </Card>
              ) : (
                <Radio.Group
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {addressList.map((addr) => (
                      <Radio key={addr.address_id} value={addr.address_id}>
                        <div
                          className={`jd-address-item ${selectedAddressId === addr.address_id ? 'selected' : ''}`}
                          onClick={() => setSelectedAddressId(addr.address_id)}
                        >
                          <div>
                            <span className="jd-address-name">{addr.name}</span>
                            <span className="jd-address-phone">{addr.phone}</span>
                            {addr.is_default && <Tag color="blue" style={{ marginLeft: 8 }}>默认</Tag>}
                          </div>
                          <div className="jd-address-detail">{getFullAddress(addr)}</div>
                        </div>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              )}
            </Spin>
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
            disabled={!selectedAddressId}
            className="jd-btn-submit-order"
            onClick={handleSubmitOrder}
          >
            提交订单
          </Button>
        </Space>
      </div>

      {/* 添加地址模态框 */}
      <Modal
        title="新增收货地址"
        open={isAddModalOpen}
        onOk={handleAddModalOk}
        onCancel={() => setIsAddModalOpen(false)}
        confirmLoading={addLoading}
        width={500}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="收货人"
            name="name"
            rules={[{ required: true, message: '请输入收货人' }]}
          >
            <Input placeholder="请输入收货人姓名" />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入手机号码" maxLength={11} />
          </Form.Item>
          <Form.Item
            label="省/市/区"
            name="region"
            rules={[{ required: true, message: '请选择省/市/区' }]}
          >
            <Cascader
              options={regionData}
              placeholder="请选择省/市/区"
              showSearch={{
                filter: (inputValue, path) =>
                  path.some(
                    (option) =>
                      (option.label as string)
                        .toLowerCase()
                        .indexOf(inputValue.toLowerCase()) > -1
                  ),
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="详细地址"
            name="detail"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input.TextArea placeholder="请输入详细地址，如街道、门牌号等" rows={3} />
          </Form.Item>
          <Form.Item
            name="is_default"
            valuePropName="checked"
            initialValue={addressList.length === 0}
          >
            <Checkbox>设为默认地址</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Checkout
