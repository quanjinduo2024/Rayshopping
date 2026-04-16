import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Row, Col, Typography, Button, Spin, message, InputNumber, Tabs, Card, Space, Tag, Divider } from 'antd'
import { ShoppingOutlined, ShoppingCartOutlined, CheckCircleOutlined, TruckOutlined, ReloadOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
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
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

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
      // 检查收藏状态
      if (userId) {
        checkFavoriteStatus()
      }
    } catch (err) {
      message.error('获取商品详情失败')
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async () => {
    if (!id || !userId) return
    try {
      const response = await shopService.checkFavorite(parseInt(id))
      setIsFavorited(response.is_favorited)
    } catch (err) {
      console.error('检查收藏状态失败', err)
    }
  }

  const handleToggleFavorite = async () => {
    if (!userId) {
      message.warning('请先登录')
      navigate('/login')
      return
    }
    if (!goods) return

    setFavoriteLoading(true)
    try {
      if (isFavorited) {
        await shopService.removeFavorite(goods.goods_id)
        setIsFavorited(false)
        message.success('已取消收藏')
      } else {
        await shopService.addFavorite(goods.goods_id)
        setIsFavorited(true)
        message.success('已添加到收藏')
      }
    } catch (err) {
      console.error('操作收藏失败', err)
      message.error(isFavorited ? '取消收藏失败' : '添加收藏失败')
    } finally {
      setFavoriteLoading(false)
    }
  }

  useEffect(() => {
    fetchGoodsDetail()
  }, [id])

  useEffect(() => {
    if (userId && goods) {
      checkFavoriteStatus()
    }
  }, [userId])

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
      // 先添加到购物车
      await shopService.addToCart({ goods_id: goods.goods_id, quantity })
      message.success('已加入购物车')
      // 跳转到购物车页面
      navigate('/cart')
    } catch (err) {
      message.error('操作失败')
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', background: 'transparent' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!goods) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', background: 'transparent' }}>
        <Title level={4} style={{ color: '#2C2A28' }}>商品不存在</Title>
        <Link to="/goods">
          <Button
            type="primary"
            style={{
              background: '#D97A4A',
              borderColor: '#D97A4A',
              borderRadius: '24px',
              marginTop: '16px',
            }}
          >
            返回商品列表
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="prd-page-content" style={{ padding: '28px 50px' }}>
      <Row gutter={32}>
        {/* 主内容区 */}
        <Col xs={24} md={18}>
          {/* 商品信息卡片 - PRD风格 */}
          <div className="prd-goods-detail">
            <Row gutter={0}>
              {/* 左侧图片区 - 减小尺寸 */}
              <Col xs={24} md={10}>
                <div className="prd-goods-gallery">
                  <div
                    className="prd-goods-image"
                    style={{
                      overflow: 'hidden',
                      borderRadius: '16px',
                      background: '#FAF9F8',
                    }}
                  >
                    {goods.image_url ? (
                      <img
                        src={goods.image_url}
                        alt={goods.name}
                        style={{
                          width: '100%',
                          height: '360px',
                          objectFit: 'contain',
                          background: '#FAF9F8',
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <ShoppingOutlined
                      style={{
                        fontSize: 100,
                        color: '#C8C6C3',
                        display: goods.image_url ? 'none' : 'block',
                      }}
                    />
                  </div>
                </div>
              </Col>

              {/* 右侧信息区 - 增加左侧留白 */}
              <Col xs={24} md={14} className="prd-goods-info" style={{ paddingLeft: '40px' }}>
                <Title
                  level={4}
                  className="prd-goods-title"
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2C2A28',
                    lineHeight: '1.5',
                    marginBottom: '12px',
                  }}
                >
                  {goods.name}
                </Title>

                {goods.intro && (
                  <Paragraph
                    className="prd-goods-summary"
                    style={{
                      color: '#8C8A87',
                      fontSize: '14px',
                      marginBottom: '20px',
                    }}
                  >
                    {goods.intro}
                  </Paragraph>
                )}

                {/* 价格区域 - PRD风格 */}
                <div
                  className="prd-price-wrap"
                  style={{
                    background: '#FAF9F8',
                    padding: '20px 24px',
                    marginBottom: '20px',
                    borderRadius: '12px',
                  }}
                >
                  <Space align="baseline">
                    <span className="prd-price-label" style={{ color: '#8C8A87', fontSize: '13px' }}>
                      售价
                    </span>
                    <span className="prd-price" style={{ color: '#D97A4A', fontSize: '28px', fontWeight: '600' }}>
                      <span className="prd-price-symbol" style={{ fontSize: '16px' }}>¥</span>
                      {goods.price.toFixed(2)}
                    </span>
                  </Space>
                </div>

                {/* 库存配送 */}
                <div className="prd-stock-wrap" style={{ marginBottom: '20px' }}>
                  <Space>
                    <span className="prd-stock-label" style={{ color: '#8C8A87', fontSize: '13px' }}>
                      库存
                    </span>
                    <Text style={{ color: '#5E5B57' }}>{goods.stock} 件</Text>
                    <Divider type="vertical" style={{ background: '#E8E6E3' }} />
                    <span className="prd-stock-label" style={{ color: '#8C8A87', fontSize: '13px' }}>
                      配送至
                    </span>
                    <Tag
                      color="#D97A4A"
                      style={{
                        borderRadius: '10px',
                        padding: '2px 10px',
                        fontSize: '12px',
                      }}
                    >
                      北京朝阳区
                    </Tag>
                    <Divider type="vertical" style={{ background: '#E8E6E3' }} />
                    <Text type="secondary" style={{ color: '#A8A6A3' }}>现货</Text>
                  </Space>
                </div>

                {/* 数量选择 */}
                <div className="prd-quantity-wrap" style={{ marginBottom: '28px' }}>
                  <span className="prd-quantity-label" style={{ color: '#8C8A87', fontSize: '13px', marginRight: '12px' }}>
                    数量
                  </span>
                  <InputNumber
                    min={1}
                    max={goods.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    size="large"
                    style={{ width: 120, borderRadius: '10px' }}
                  />
                  <Text type="secondary" style={{ marginLeft: '12px', color: '#A8A6A3', fontSize: '13px' }}>
                    （库存 {goods.stock} 件）
                  </Text>
                </div>

                {/* 操作按钮 - PRD风格 */}
                <Space size="large" style={{ marginTop: '8px' }}>
                  <Button
                    size="large"
                    icon={isFavorited ? <StarFilled /> : <StarOutlined />}
                    onClick={handleToggleFavorite}
                    loading={favoriteLoading}
                    style={{
                      color: isFavorited ? '#D97A4A' : '#5E5B57',
                      borderRadius: '24px',
                      height: '48px',
                      padding: '0 24px',
                      borderColor: isFavorited ? '#D97A4A' : '#E8E6E3',
                      background: '#fff',
                    }}
                  >
                    {isFavorited ? '已收藏' : '收藏'}
                  </Button>
                  <Button
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="prd-btn-cart"
                    onClick={handleAddToCart}
                    style={{
                      borderRadius: '24px',
                      height: '48px',
                      padding: '0 32px',
                      background: '#fff',
                      border: '1px solid #D97A4A',
                      color: '#D97A4A',
                      fontWeight: '500',
                    }}
                  >
                    加入购物车
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    className="prd-btn-buy"
                    onClick={handleBuyNow}
                    style={{
                      borderRadius: '24px',
                      height: '48px',
                      padding: '0 40px',
                      background: '#D97A4A',
                      borderColor: '#D97A4A',
                      fontWeight: '500',
                    }}
                  >
                    立即购买
                  </Button>
                </Space>

                {/* 服务保障 - PRD风格 */}
                <div className="prd-service-wrap" style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #EFEDEA' }}>
                  <Space wrap size="large">
                    <span className="prd-service-item" style={{ color: '#8C8A87', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                      正品保障
                    </span>
                    <span className="prd-service-item" style={{ color: '#8C8A87', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ReloadOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                      7天无理由
                    </span>
                    <span className="prd-service-item" style={{ color: '#8C8A87', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TruckOutlined style={{ color: '#D97A4A', fontSize: '16px' }} />
                      极速配送
                    </span>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>

          {/* 商品详情 Tab - PRD风格 */}
          <div className="prd-detail-tab" style={{ marginTop: '28px' }}>
            <Tabs
              defaultActiveKey="intro"
              size="large"
              items={[
                {
                  key: 'intro',
                  label: <span style={{ fontSize: '15px' }}>商品介绍</span>,
                  children: (
                    <div className="prd-detail-content" style={{ padding: '32px', minHeight: '280px' }}>
                      {goods.description ? (
                        <div style={{ whiteSpace: 'pre-line', color: '#5E5B57', lineHeight: '1.8' }}>
                          {goods.description.split('\n').map((line, index) => (
                            <Paragraph key={index}>{line}</Paragraph>
                          ))}
                        </div>
                      ) : (
                        <>
                          <Title level={4} style={{ color: '#2C2A28', fontSize: '18px', fontWeight: '600' }}>
                            商品详情
                          </Title>
                          <Paragraph style={{ color: '#8C8A87' }}>暂无商品详情</Paragraph>
                        </>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'spec',
                  label: <span style={{ fontSize: '15px' }}>规格参数</span>,
                  children: (
                    <div className="prd-detail-content" style={{ padding: '32px', minHeight: '280px' }}>
                      <Title
                        level={4}
                        style={{
                          color: '#2C2A28',
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '24px',
                        }}
                      >
                        规格参数
                      </Title>
                      <Row gutter={[24, 24]}>
                        <Col span={12}>
                          <Text strong style={{ color: '#8C8A87', marginRight: '8px' }}>商品名称：</Text>
                          <Text style={{ color: '#2C2A28' }}>{goods.name}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong style={{ color: '#8C8A87', marginRight: '8px' }}>商品分类：</Text>
                          <Text style={{ color: '#2C2A28' }}>{goods.category || '未分类'}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong style={{ color: '#8C8A87', marginRight: '8px' }}>商品价格：</Text>
                          <Text style={{ color: '#D97A4A', fontWeight: '600' }}>¥{goods.price.toFixed(2)}</Text>
                        </Col>
                        <Col span={12}>
                          <Text strong style={{ color: '#8C8A87', marginRight: '8px' }}>库存数量：</Text>
                          <Text style={{ color: '#2C2A28' }}>{goods.stock} 件</Text>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: 'package',
                  label: <span style={{ fontSize: '15px' }}>包装清单</span>,
                  children: (
                    <div className="prd-detail-content" style={{ padding: '32px', minHeight: '280px' }}>
                      <Title
                        level={4}
                        style={{
                          color: '#2C2A28',
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '24px',
                        }}
                      >
                        包装清单
                      </Title>
                      <Paragraph style={{ color: '#5E5B57', lineHeight: '2' }}>
                        {goods.name} × 1<br />
                        说明书 × 1<br />
                        保修卡 × 1
                      </Paragraph>
                    </div>
                  ),
                },
              ]}
              styles={{
                tabBar: { borderBottom: '1px solid #EFEDEA' },
                item: { marginRight: '32px' },
              }}
              tabBarStyle={{ color: '#5E5B57' }}
            />
          </div>
        </Col>

        {/* 侧边推荐 - PRD风格 */}
        <Col xs={24} md={6}>
          <Card
            title={<span style={{ color: '#2C2A28', fontWeight: '600', fontSize: '15px' }}>看了又看</span>}
            style={{ marginBottom: 20, borderRadius: '16px', border: 'none' }}
            styles={{ header: { borderBottom: '1px solid #EFEDEA' } }}
          >
            {relatedGoods.map((item) => (
              <div
                key={item.goods_id}
                style={{
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: '1px solid #FAF9F8',
                }}
              >
                <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: '#FAF9F8',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        overflow: 'hidden',
                      }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <ShoppingOutlined style={{ color: '#C8C6C3', fontSize: '24px' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#2C2A28',
                          marginBottom: 6,
                          lineHeight: '1.4',
                          height: '36px',
                          overflow: 'hidden',
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ color: '#D97A4A', fontWeight: '600', fontSize: '15px' }}>
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
