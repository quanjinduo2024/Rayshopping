import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Row, Col, Typography, Button, Spin, message, InputNumber, Tabs, Card, Space, Tag, Divider } from 'antd'
import { ShoppingOutlined, ShoppingCartOutlined, CheckCircleOutlined, TruckOutlined, ReloadOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { shopService } from '@/services/shopService'
import type { Goods } from '@/types/goods'

const { Title, Text, Paragraph } = Typography

const GoodsDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId } = useSelector((state: RootState) => state.user)
  const [goods, setGoods] = useState<Goods | null>(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [relatedGoods, setRelatedGoods] = useState<Goods[]>([])

  const fetchGoodsDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await shopService.getGoodsDetail(parseInt(id))
      // 转换 price 为数字类型
      const goodsData = { ...data, price: Number(data.price) }
      setGoods(goodsData)
      // 获取相关推荐商品
      const listData = await shopService.getGoodsList(1, 4)
      // 同样转换相关商品的 price
      const relatedItems = listData.items
        .filter((item: Goods) => item.goods_id !== parseInt(id))
        .map((item: Goods) => ({ ...item, price: Number(item.price) }))
      setRelatedGoods(relatedItems)
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
      <div style={{ textAlign: 'center', padding: '100px 0', background: '#fff' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!goods) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', background: '#fff' }}>
        <Title level={4}>商品不存在</Title>
        <Link to="/goods">
          <Button type="primary">返回商品列表</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="jd-page-content" style={{ padding: '20px 50px' }}>
      <Row gutter={20}>
        {/* 主内容区 */}
        <Col xs={24} md={18}>
          {/* 商品信息卡片 */}
          <div className="jd-goods-detail">
            <Row gutter={0}>
              {/* 左侧图片区 */}
              <Col xs={24} md={10}>
                <div className="jd-goods-gallery">
                  <div className="jd-goods-image">
                    <ShoppingOutlined style={{ fontSize: 120, color: '#ddd' }} />
                  </div>
                </div>
              </Col>

              {/* 右侧信息区 */}
              <Col xs={24} md={14} className="jd-goods-info">
                <Title level={4} className="jd-goods-title">
                  {goods.name}
                </Title>

                {goods.intro && (
                  <Paragraph className="jd-goods-summary">
                    {goods.intro}
                  </Paragraph>
                )}

                {/* 价格区域 */}
                <div className="jd-price-wrap">
                  <Space align="baseline">
                    <span className="jd-price-label">京东价</span>
                    <span className="jd-price">
                      <span className="jd-price-symbol">¥</span>
                      {goods.price.toFixed(2)}
                    </span>
                  </Space>
                </div>

                {/* 库存配送 */}
                <div className="jd-stock-wrap">
                  <Space>
                    <span className="jd-stock-label">库存</span>
                    <Text>{goods.stock} 件</Text>
                    <Divider type="vertical" />
                    <span className="jd-stock-label">配送至</span>
                    <Tag color="blue">北京朝阳区</Tag>
                    <Divider type="vertical" />
                    <Text type="secondary">现货</Text>
                  </Space>
                </div>

                {/* 数量选择 */}
                <div className="jd-quantity-wrap">
                  <span className="jd-quantity-label">数量</span>
                  <InputNumber
                    min={1}
                    max={goods.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    size="large"
                    style={{ width: 120 }}
                  />
                  <Text type="secondary" style={{ marginLeft: 10 }}>
                    （库存 {goods.stock} 件）
                  </Text>
                </div>

                {/* 操作按钮 */}
                <Space size="large" style={{ marginTop: 30 }}>
                  <Button
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="jd-btn-cart"
                    onClick={handleAddToCart}
                  >
                    加入购物车
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    className="jd-btn-buy"
                    onClick={handleBuyNow}
                  >
                    立即购买
                  </Button>
                </Space>

                {/* 服务保障 */}
                <div className="jd-service-wrap">
                  <Space wrap>
                    <span className="jd-service-item">
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                      正品保障
                    </span>
                    <span className="jd-service-item">
                      <ReloadOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                      7天无理由
                    </span>
                    <span className="jd-service-item">
                      <TruckOutlined style={{ color: '#faad14', marginRight: 4 }} />
                      极速配送
                    </span>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>

          {/* 商品详情 Tab */}
          <div className="jd-detail-tab">
            <Tabs
              defaultActiveKey="intro"
              items={[
                {
                  key: 'intro',
                  label: '商品介绍',
                  children: (
                    <div className="jd-detail-content">
                      <Title level={4}>商品详情</Title>
                      <Paragraph>
                        这里是商品的详细介绍内容，包含商品的规格参数、使用说明、包装清单等信息。
                      </Paragraph>
                      <Paragraph>
                        （图文详情展示区域）
                      </Paragraph>
                    </div>
                  ),
                },
                {
                  key: 'spec',
                  label: '规格参数',
                  children: (
                    <div className="jd-detail-content">
                      <Title level={4}>规格参数</Title>
                      <Paragraph>商品规格参数信息...</Paragraph>
                    </div>
                  ),
                },
                {
                  key: 'package',
                  label: '包装清单',
                  children: (
                    <div className="jd-detail-content">
                      <Title level={4}>包装清单</Title>
                      <Paragraph>商品包装清单信息...</Paragraph>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Col>

        {/* 侧边推荐 */}
        <Col xs={24} md={6}>
          <Card title="看了又看" style={{ marginBottom: 20 }}>
            {relatedGoods.map((item) => (
              <div key={item.goods_id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <ShoppingOutlined style={{ color: '#999' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#333', marginBottom: 4 }}>
                        {item.name}
                      </div>
                      <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                        ¥{item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default GoodsDetail
