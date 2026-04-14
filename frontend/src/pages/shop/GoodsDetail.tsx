import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Button, Spin, message, InputNumber } from 'antd'
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { shopService } from '@/services/shopService'
import type { Goods } from '@/types/goods'

const { Title, Paragraph, Text } = Typography

const GoodsDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId } = useSelector((state: RootState) => state.user)
  const [goods, setGoods] = useState<Goods | null>(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const fetchGoodsDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await shopService.getGoodsDetail(parseInt(id))
      setGoods(data)
    } catch (err) {
      message.error('获取商品详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoodsDetail()
  }, [id])

  const handleAddToCart = async () => {
    if (!userId) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!goods) return

    try {
      await shopService.addToCart({ goods_id: goods.goods_id, quantity })
      message.success('已加入购物车')
    } catch (err) {
      message.error('添加购物车失败')
    }
  }

  const handleBuyNow = async () => {
    if (!userId) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!goods) return

    try {
      const order = await shopService.checkoutDirect({ goods_id: goods.goods_id, quantity })
      message.success('下单成功')
      navigate(`/orders/${order.order_id}`)
    } catch (err) {
      message.error('下单失败')
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!goods) {
    return <div>商品不存在</div>
  }

  return (
    <div>
      <Card>
        <Row gutter={32}>
          <Col xs={24} md={10}>
            <div
              style={{
                height: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                borderRadius: 8,
              }}
            >
              <ShoppingOutlined style={{ fontSize: 80, color: '#999' }} />
            </div>
          </Col>
          <Col xs={24} md={14}>
            <Title level={2}>{goods.name}</Title>
            <Title level={1} type="danger" style={{ margin: '24px 0' }}>
              ¥{goods.price.toFixed(2)}
            </Title>
            <Paragraph style={{ fontSize: 16 }}>{goods.intro || '暂无描述'}</Paragraph>
            <Text type="secondary">库存：{goods.stock} 件</Text>
            <div style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <span style={{ marginRight: 16 }}>数量：</span>
                <InputNumber
                  min={1}
                  max={goods.stock}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  size="large"
                />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <Button
                  type="default"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  加入购物车
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBuyNow}
                >
                  立即购买
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default GoodsDetail
