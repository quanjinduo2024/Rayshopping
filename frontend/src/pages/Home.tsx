import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout, Row, Col, Card, Carousel, Typography, Space, Button, List, Tag, Spin, message } from 'antd'
import { ShoppingOutlined, RightOutlined, FireOutlined, StarOutlined, StarFilled, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { shopService } from '@/services/shopService'
import type { Goods } from '@/types/goods'

const { Content, Sider } = Layout
const { Title, Paragraph, Text } = Typography
const { Meta } = Card

const Home = () => {
  const navigate = useNavigate()
  const { userId } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState(false)
  const [allGoods, setAllGoods] = useState<Goods[]>([])
  const [hotProducts, setHotProducts] = useState<Goods[]>([])
  const [newProducts, setNewProducts] = useState<Goods[]>([])
  const [favoritedIds, setFavoritedIds] = useState<number[]>([])

  // 获取商品数据
  const fetchGoods = async () => {
    setLoading(true)
    try {
      const response = await shopService.getGoodsList(1, 100)
      // 转换 price 为数字类型
      const goodsList = response.items.map((item: Goods) => ({
        ...item,
        price: Number(item.price),
      }))
      setAllGoods(goodsList)

      // 随机打乱商品
      const shuffled = [...goodsList].sort(() => Math.random() - 0.5)
      setHotProducts(shuffled.slice(0, 4))
      setNewProducts(shuffled.slice(4, 8))
    } catch (err) {
      console.error('获取商品列表失败', err)
    } finally {
      setLoading(false)
    }
  }

  // 获取收藏的商品ID列表
  const fetchFavoriteIds = async () => {
    if (!userId) {
      setFavoritedIds([])
      return
    }
    try {
      const response = await shopService.getFavoriteIds()
      setFavoritedIds(response.ids)
    } catch (err) {
      console.error('获取收藏列表失败', err)
    }
  }

  // 切换收藏状态
  const handleToggleFavorite = async (goodsId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!userId) {
      message.warning('请先登录')
      navigate('/login')
      return
    }

    const isFavorited = favoritedIds.includes(goodsId)
    try {
      if (isFavorited) {
        await shopService.removeFavorite(goodsId)
        setFavoritedIds((prev) => prev.filter((id) => id !== goodsId))
        message.success('已取消收藏')
      } else {
        await shopService.addFavorite(goodsId)
        setFavoritedIds((prev) => [...prev, goodsId])
        message.success('已添加到收藏')
      }
    } catch (err) {
      console.error('操作收藏失败', err)
      message.error(isFavorited ? '取消收藏失败' : '添加收藏失败')
    }
  }

  useEffect(() => {
    fetchGoods()
  }, [])

  useEffect(() => {
    fetchFavoriteIds()
  }, [userId])

  // 左侧分类菜单
  const categories = [
    { id: 1, name: '手机数码', icon: '📱' },
    { id: 2, name: '电脑办公', icon: '💻' },
    { id: 3, name: '家用电器', icon: '🏠' },
    { id: 4, name: '服饰鞋包', icon: '👔' },
    { id: 5, name: '美妆个护', icon: '💄' },
    { id: 6, name: '食品生鲜', icon: '🍎' },
  ]

  // 分类点击跳转到商品列表并筛选
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/goods?category=${encodeURIComponent(categoryName)}`)
  }

  // 立即查看跳转到商品列表区域
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('products-section')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 轮播图数据 - PRD风格
  const carouselImages = [
    { id: 1, title: '新品首发', subtitle: '品质生活 焕新之选', bg: 'linear-gradient(135deg, #F5F0EC 0%, #E8E0D8 100%)', textColor: '#2C2A28' },
    { id: 2, title: '限时特惠', subtitle: '精选好物 超值来袭', bg: 'linear-gradient(135deg, #FDF8F5 0%, #F5ECE5 100%)', textColor: '#2C2A28' },
    { id: 3, title: '会员专享', subtitle: '专属礼遇 贴心服务', bg: 'linear-gradient(135deg, #F8F9F8 0%, #EEEFEE 100%)', textColor: '#2C2A28' },
  ]

  // 商品卡片组件 - PRD风格
  const ProductCard = ({ item, showNewTag = false }: { item: Goods; showNewTag?: boolean }) => (
    <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
      <Card
        hoverable
        className="prd-product-card"
        style={{ height: '100%' }}
        cover={
          <div style={{ position: 'relative' }}>
            <div
              style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FAF9F8',
                overflow: 'hidden',
                borderRadius: '16px 16px 0 0',
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '80px', opacity: 0.6 }}>{showNewTag ? '⌚' : '📱'}</span>
              )}
            </div>
            <Button
              type="text"
              icon={
                favoritedIds.includes(item.goods_id) ? (
                  <StarFilled style={{ color: '#D97A4A', fontSize: 20 }} />
                ) : (
                  <StarOutlined style={{ color: '#C8C6C3', fontSize: 20 }} />
                )
              }
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                border: 'none',
                padding: 0,
                minWidth: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onClick={(e) => handleToggleFavorite(item.goods_id, e)}
            />
          </div>
        }
        styles={{ body: { padding: '16px 20px 20px' } }}
      >
        <Meta
          title={
            <div className="product-name" style={{ height: '40px', overflow: 'hidden', lineHeight: '20px' }}>
              <Text style={{ fontSize: '14px', color: '#2C2A28', fontWeight: '500' }}>{item.name}</Text>
            </div>
          }
          description={
            <div>
              <div className="prd-price" style={{ marginTop: '12px' }}>
                ¥{item.price.toFixed(2)}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: '12px', color: '#A8A6A3' }}>
                  销量 {Math.floor(Math.random() * 10000)}+
                </Text>
                {showNewTag && <Tag color="#D97A4A" style={{ fontSize: '11px', margin: 0, borderRadius: '10px' }}>新品</Tag>}
              </div>
            </div>
          }
        />
      </Card>
    </Link>
  )

  return (
    <Layout style={{ background: 'transparent' }} className="prd-page-content">
      <Row style={{ padding: '24px 50px' }} gutter={24}>
        {/* 左侧分类菜单 */}
        <Col xs={24} md={5}>
          <Card
            className="prd-category-menu"
            style={{ padding: 0 }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={categories}
              renderItem={(item) => (
                <List.Item
                  className="prd-category-item"
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #FAF9F8',
                  }}
                  onClick={() => handleCategoryClick(item.name)}
                >
                  <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ color: '#5E5B57', fontSize: '14px' }}>{item.name}</span>
                  <RightOutlined style={{ marginLeft: 'auto', color: '#C8C6C3', fontSize: '12px' }} />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 中间轮播图 */}
        <Col xs={24} md={13}>
          <Carousel
            className="prd-carousel"
            autoplay
            dotPosition="bottom"
            style={{ borderRadius: '16px', overflow: 'hidden' }}
          >
            {carouselImages.map((item) => (
              <div key={item.id}>
                <div
                  style={{
                    height: '380px',
                    background: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: item.textColor,
                  }}
                >
                  <Title level={2} style={{ color: item.textColor, marginBottom: '12px', fontWeight: '600' }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: item.textColor, fontSize: '16px', opacity: 0.7 }}>
                    {item.subtitle}
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleScrollToProducts}
                    style={{
                      marginTop: '24px',
                      background: '#D97A4A',
                      borderColor: '#D97A4A',
                      borderRadius: '24px',
                      padding: '0 32px',
                      height: '44px',
                    }}
                  >
                    立即查看
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>

        {/* 右侧快捷入口 */}
        <Col xs={24} md={6}>
          <Card
            title={<span style={{ color: '#2C2A28', fontWeight: '600', fontSize: '15px' }}>快捷入口</span>}
            style={{ marginBottom: '20px', borderRadius: '16px', border: 'none' }}
            styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}
          >
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Link to="/orders" style={{ width: '100%', display: 'block' }}>
                  <Button
                    type="text"
                    block
                    icon={<ShoppingOutlined style={{ color: '#D97A4A' }} />}
                    style={{ borderRadius: '12px', height: '64px', background: '#FAF9F8' }}
                  >
                    <span style={{ color: '#2C2A28' }}>我的订单</span>
                  </Button>
                </Link>
              </Col>
              <Col span={12}>
                <Link to="/favorites" style={{ width: '100%', display: 'block' }}>
                  <Button
                    type="text"
                    block
                    icon={<StarOutlined style={{ color: '#D97A4A' }} />}
                    style={{ borderRadius: '12px', height: '64px', background: '#FAF9F8' }}
                  >
                    <span style={{ color: '#2C2A28' }}>我的收藏</span>
                  </Button>
                </Link>
              </Col>
              <Col span={12}>
                <Link to="/cart" style={{ width: '100%', display: 'block' }}>
                  <Button
                    type="text"
                    block
                    icon={<ShoppingCartOutlined style={{ color: '#D97A4A' }} />}
                    style={{ borderRadius: '12px', height: '64px', background: '#FAF9F8' }}
                  >
                    <span style={{ color: '#2C2A28' }}>购物车</span>
                  </Button>
                </Link>
              </Col>
              <Col span={12}>
                <Link to="/profile" style={{ width: '100%', display: 'block' }}>
                  <Button
                    type="text"
                    block
                    icon={<UserOutlined style={{ color: '#D97A4A' }} />}
                    style={{ borderRadius: '12px', height: '64px', background: '#FAF9F8' }}
                  >
                    <span style={{ color: '#2C2A28' }}>会员中心</span>
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>

          <Card
            title={<span style={{ color: '#2C2A28', fontWeight: '600', fontSize: '15px' }}>限时活动</span>}
            style={{ borderRadius: '16px', border: 'none' }}
            styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tag
                  color="#D97A4A"
                  icon={<FireOutlined />}
                  style={{ borderRadius: '10px', padding: '2px 10px' }}
                >
                  限时特惠
                </Tag>
                <Text type="secondary" style={{ color: '#A8A6A3', fontSize: '13px' }}>更多 &gt;</Text>
              </div>
              <div style={{ background: '#FFF9F5', padding: '18px', borderRadius: '12px' }}>
                <Text strong style={{ color: '#D97A4A', fontSize: '16px', fontWeight: '600' }}>
                  10:00 场即将开始
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '13px', color: '#8C8A87', marginTop: '4px' }}>
                  爆款商品5折起
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 热门商品 */}
      <div id="products-section" style={{ padding: '24px 50px' }}>
        <Spin spinning={loading}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FireOutlined style={{ color: '#D97A4A', marginRight: '10px' }} />
                <span style={{ color: '#2C2A28', fontWeight: '600', fontSize: '18px' }}>热销爆款</span>
                <Link to="/goods" style={{ marginLeft: 'auto', fontSize: '14px', color: '#8C8A87' }}>
                  查看更多 <RightOutlined />
                </Link>
              </div>
            }
            style={{ marginBottom: '24px', borderRadius: '16px', border: 'none' }}
            styles={{ header: { borderBottom: 'none' } }}
          >
            <Row gutter={[20, 20]}>
              {hotProducts.map((item) => (
                <Col xs={24} sm={12} md={6} key={item.goods_id}>
                  <ProductCard item={item} />
                </Col>
              ))}
            </Row>
          </Card>

          {/* 新品上市 */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <StarOutlined style={{ color: '#D97A4A', marginRight: '10px' }} />
                <span style={{ color: '#2C2A28', fontWeight: '600', fontSize: '18px' }}>新品上市</span>
                <Link to="/goods" style={{ marginLeft: 'auto', fontSize: '14px', color: '#8C8A87' }}>
                  查看更多 <RightOutlined />
                </Link>
              </div>
            }
            style={{ borderRadius: '16px', border: 'none' }}
            styles={{ header: { borderBottom: 'none' } }}
          >
            <Row gutter={[20, 20]}>
              {newProducts.map((item) => (
                <Col xs={24} sm={12} md={6} key={item.goods_id}>
                  <ProductCard item={item} showNewTag />
                </Col>
              ))}
            </Row>
          </Card>
        </Spin>
      </div>

      {/* 底部服务 */}
      <div
        style={{
          background: '#fff',
          padding: '48px 50px',
          marginTop: '48px',
          borderTop: '1px solid #EFEDEA',
        }}
      >
        <Row gutter={48}>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.8 }}>🚚</div>
            <Text strong style={{ color: '#2C2A28', fontSize: '15px', fontWeight: '600' }}>
              闪电配送
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '13px', color: '#8C8A87', marginTop: '6px' }}>
              极速发货，次日送达
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.8 }}>💯</div>
            <Text strong style={{ color: '#2C2A28', fontSize: '15px', fontWeight: '600' }}>
              正品保障
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '13px', color: '#8C8A87', marginTop: '6px' }}>
              100%正品，假一赔十
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.8 }}>🔄</div>
            <Text strong style={{ color: '#2C2A28', fontSize: '15px', fontWeight: '600' }}>
              7天无理由
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '13px', color: '#8C8A87', marginTop: '6px' }}>
              7天无理由退换货
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.8 }}>💬</div>
            <Text strong style={{ color: '#2C2A28', fontSize: '15px', fontWeight: '600' }}>
              贴心服务
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '13px', color: '#8C8A87', marginTop: '6px' }}>
              7x24小时客服在线
            </Text>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default Home
