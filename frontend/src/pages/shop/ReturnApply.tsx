import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Typography, Spin, message, Button, Card, Form, Input, Radio, Space, Row, Col } from 'antd'
import { ArrowLeftOutlined, UndoOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { OrderDetail as OrderDetailType, OrderReturnCreate } from '@/types/order'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const ReturnApply = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [order, setOrder] = useState<OrderDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

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
      form.setFieldsValue({
        order_id: parseInt(id),
        type: 'return',
      })
    } catch (err) {
      message.error('获取订单详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true)
    try {
      const returnData: OrderReturnCreate = {
        order_id: values.order_id,
        type: values.type,
        reason: values.reason,
        remark: values.remark,
      }
      await shopService.createReturn(returnData)
      message.success('申请提交成功！')
      navigate('/profile?tab=returns')
    } catch (err) {
      message.error('提交申请失败')
    } finally {
      setSubmitLoading(false)
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

  return (
    <div className="prd-page-content" style={{ padding: '24px 50px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link to={`/orders/${id}`}>
          <Button icon={<ArrowLeftOutlined />} style={{ borderRadius: 20, marginRight: 16 }}>
            返回订单详情
          </Button>
        </Link>
        <Title level={2} style={{ color: '#2C2A28', margin: 0 }}>
          <UndoOutlined style={{ marginRight: 8, color: '#D97A4A' }} />
          申请退货/换货
        </Title>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card title="申请信息" style={{ borderRadius: 16, border: 'none' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ type: 'return' }}
            >
              <Form.Item name="order_id" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                label="申请类型"
                name="type"
                rules={[{ required: true, message: '请选择申请类型' }]}
              >
                <Radio.Group>
                  <Radio value="return">退货</Radio>
                  <Radio value="exchange">换货</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="申请原因"
                name="reason"
                rules={[{ required: true, message: '请填写申请原因' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请详细描述您的退货/换货原因"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item label="备注" name="remark">
                <TextArea
                  rows={3}
                  placeholder="其他补充信息（可选）"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitLoading} style={{ borderRadius: 20 }}>
                    提交申请
                  </Button>
                  <Link to={`/orders/${id}`}>
                    <Button style={{ borderRadius: 20 }}>取消</Button>
                  </Link>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="订单信息" style={{ borderRadius: 16, border: 'none' }}>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>订单号：</Text>
              <Text strong style={{ color: '#2C2A28' }}>{order.order_id}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>下单时间：</Text>
              <Text style={{ color: '#5E5B57' }}>{new Date(order.create_time).toLocaleString()}</Text>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ color: '#8C8A87' }}>订单金额：</Text>
              <Text style={{ fontSize: 20, color: '#D97A4A', fontWeight: 'bold' }}>
                ¥{order.total_price.toFixed(2)}
              </Text>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #EFEDEA' }}>
              <Text type="secondary" style={{ color: '#8C8A87', marginBottom: 8, display: 'block' }}>
                商品清单
              </Text>
              {order.items.map((item) => (
                <div key={item.item_id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#2C2A28' }}>
                    {item.goods_name || `商品 #${item.goods_id}`} x{item.quantity}
                  </Text>
                  <Text style={{ color: '#5E5B57' }}>
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ReturnApply
