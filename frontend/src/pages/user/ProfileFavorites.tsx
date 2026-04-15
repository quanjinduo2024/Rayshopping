import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Spin, message, Empty, Row, Col, Card } from 'antd'
import { StarFilled, ShoppingOutlined, DeleteOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { FavoriteItem } from '@/types/favorite'

const { Title, Text } = Typography
const { Meta } = Card

const ProfileFavorites = () => {
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
    <div>
      <Spin spinning={loading}>
        {favorites.length === 0 ? (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无收藏商品"
            >
              <Link to="/goods">
                <Button type="primary" icon={<ShoppingOutlined />}>
                  去逛逛
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {favorites.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.favorite_id}>
                <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
                  <Card
                    hoverable
                    className="jd-product-card"
                    cover={
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            height: '160px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                            overflow: 'hidden',
                          }}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.goods_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '50px' }}>📦</span>
                          )}
                        </div>
                        <Button
                          type="text"
                          icon={<StarFilled style={{ color: '#faad14', fontSize: 18 }} />}
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            padding: 0,
                          }}
                          onClick={(e) => handleRemoveFavorite(item.goods_id, e)}
                        />
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleRemoveFavorite(item.goods_id, e)}
                      >
                        取消收藏
                      </Button>,
                    ]}
                  >
                    <Meta
                      title={
                        <div className="product-name" style={{ height: '40px', overflow: 'hidden', fontSize: '13px' }}>
                          {item.goods_name}
                        </div>
                      }
                      description={
                        <div>
                          <div className="jd-price" style={{ marginTop: '4px', fontSize: '16px' }}>
                            ¥{item.price?.toFixed(2)}
                          </div>
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

export default ProfileFavorites
