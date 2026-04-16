import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Button, Card, Typography, Spin, message, Row, Col, Space } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { Goods, GoodsCreate, GoodsUpdate } from '../types'

const { Title } = Typography
const { TextArea } = Input

const GoodsEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const isEdit = id && id !== 'new'

  useEffect(() => {
    if (isEdit) {
      fetchGoodsDetail()
    }
  }, [id])

  const fetchGoodsDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const goods = await adminService.getGoodsDetail(parseInt(id))
      form.setFieldsValue({
        name: goods.name,
        price: Number(goods.price),
        intro: goods.intro,
        description: goods.description,
        image_url: goods.image_url,
        category: goods.category,
        stock: goods.stock,
      })
    } catch (err) {
      message.error('获取商品详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true)
    try {
      if (isEdit && id) {
        const updateData: GoodsUpdate = {
          ...values,
        }
        await adminService.updateGoods(parseInt(id), updateData)
        message.success('更新成功')
      } else {
        const createData: GoodsCreate = {
          ...values,
        }
        await adminService.createGoods(createData)
        message.success('创建成功')
      }
      navigate('/goods')
    } catch (err) {
      message.error(isEdit ? '更新失败' : '创建失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{ borderRadius: '12px', marginRight: 16 }}
          onClick={() => navigate('/goods')}
        >
          返回
        </Button>
        <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600' }}>
          {isEdit ? '编辑商品' : '添加商品'}
        </Title>
      </div>

      <Card style={{ borderRadius: '16px', border: 'none' }}>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ stock: 0 }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="商品名称"
                  name="name"
                  rules={[{ required: true, message: '请输入商品名称' }]}
                >
                  <Input placeholder="请输入商品名称" style={{ borderRadius: '12px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="商品价格"
                  name="price"
                  rules={[{ required: true, message: '请输入商品价格' }]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    placeholder="请输入价格"
                    style={{ width: '100%', borderRadius: '12px' }}
                    addonBefore="¥"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="商品分类"
                  name="category"
                >
                  <Input placeholder="请输入商品分类" style={{ borderRadius: '12px' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="库存数量"
                  name="stock"
                  rules={[{ required: true, message: '请输入库存数量' }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="请输入库存"
                    style={{ width: '100%', borderRadius: '12px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="商品图片URL"
              name="image_url"
            >
              <Input placeholder="请输入商品图片URL" style={{ borderRadius: '12px' }} />
            </Form.Item>

            <Form.Item
              label="商品简介"
              name="intro"
            >
              <TextArea
                rows={3}
                placeholder="请输入商品简介"
                style={{ borderRadius: '12px' }}
              />
            </Form.Item>

            <Form.Item
              label="商品详情"
              name="description"
            >
              <TextArea
                rows={6}
                placeholder="请输入商品详情"
                style={{ borderRadius: '12px' }}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  style={{ borderRadius: '12px' }}
                  onClick={() => navigate('/goods')}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  icon={<SaveOutlined />}
                  style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px' }}
                >
                  {isEdit ? '保存修改' : '创建商品'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  )
}

export default GoodsEdit
