import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Typography, Spin, message, Empty, Row, Col, Card } from 'antd'
import { StarOutlined, StarFilled, ShoppingOutlined, DeleteOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { FavoriteItem } from '@/types/favorite'

const { Title, Text } = Typography
const { Meta } = Card

const Favorites = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await shopService.getFavoriteList()
      const items = response.items.map((item) => ({
        ...item,
        price: Number(item.price),
      }))
      setFavorites(items)
    } catch (err) {
      console.error('获取收藏列表失败', err)
      message.error('获取收藏列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (goodsId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await shopService.removeFavorite(goodsId)
      message.success('已取消收藏')
      fetchFavorites()
    } catch (err) {
      console.error('取消收藏失败', err)
      message.error('取消收藏失败')
    }
  }

  return (
    <div className="prd-page-content" style={{ padding: '28px 50px' }}>
      <Title level={2} style={{ marginBottom: 24, color: '#2C2A28', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <StarFilled style={{ color: '#D97A4A' }} />
        我的收藏
      </Title>

      <Spin spinning={loading}>
        {favorites.length === 0 ? (
          <div style={{ background: '#fff', padding: '80px 0', textAlign: 'center', borderRadius: '16px' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span style={{ color: '#8C8A87' }}>暂无收藏商品</span>}
            >
              <Link to="/goods">
                <Button type="primary" size="large" icon={<ShoppingOutlined />} style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px', height: '44px', padding: '0 32px' }}>
                  去逛逛
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <Row gutter={[20, 20]}>
            {favorites.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.favorite_id}>
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
                              alt={item.goods_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '60px', opacity: 0.6 }}>📦</span>
                          )}
                        </div>
                        <Button
                          type="text"
                          icon={<StarFilled style={{ color: '#D97A4A', fontSize: 20 }} />}
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            padding: 0,
                            minWidth: 'auto',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: 'none',
                          }}
                          onClick={(e) => handleRemoveFavorite(item.goods_id, e)}
                        />
                      </div>
                    }
                    styles={{ body: { padding: '16px 20px 20px' } }}
                  >
                    <Meta
                      title={
                        <div className="product-name" style={{ height: '40px', overflow: 'hidden', lineHeight: '20px' }}>
                          <Text style={{ fontSize: '14px', color: '#2C2A28', fontWeight: '500' }}>
                            {item.goods_name}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <div className="prd-price" style={{ marginTop: '12px' }}>
                            ¥{item.price?.toFixed(2)}
                          </div>
                          {item.intro && (
                            <Text type="secondary" style={{ fontSize: '12px', color: '#A8A6A3', marginTop: '8px', display: 'block' }}>
                              {item.intro}
                            </Text>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </div>
  )
}

export default Favorites
