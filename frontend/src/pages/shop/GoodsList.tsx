import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Row, Col, Card, Pagination, Typography, Spin, Empty, Breadcrumb, Space, Button, Select, message } from 'antd'
import { ShoppingOutlined, HomeOutlined, FilterOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { shopService } from '@/services/shopService'
import type { Goods } from '@/types/goods'

const { Title, Text } = Typography
const { Meta } = Card
const { Option } = Select

const GoodsList = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { userId } = useSelector((state: RootState) => state.user)
  const keyword = searchParams.get('keyword')
  const category = searchParams.get('category')
  const urlSort = searchParams.get('sort')
  const urlTag = searchParams.get('tag')

  const [goods, setGoods] = useState<Goods[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [sortBy, setSortBy] = useState(urlSort || urlTag || 'default')
  const [favoritedIds, setFavoritedIds] = useState<number[]>([])

  const fetchGoodsList = async () => {
    setLoading(true)
    try {
      const response = await shopService.getGoodsList(page, pageSize, category || undefined)
      // 转换 price 为数字类型
      let goodsWithNumericPrice = response.items.map((item: Goods) => ({
        ...item,
        price: Number(item.price),
      }))

      // 前端排序（后端暂不支持，前端处理）
      if (sortBy === 'new' || sortBy === 'flash') {
        // 新品/闪购：按ID倒序（模拟最新）
        goodsWithNumericPrice = [...goodsWithNumericPrice].sort((a, b) => b.goods_id - a.goods_id)
      } else if (sortBy === 'hot' || sortBy === 'sales') {
        // 热卖/销量：按价格随机（模拟销量）
        goodsWithNumericPrice = [...goodsWithNumericPrice].sort(() => Math.random() - 0.5)
      } else if (sortBy === 'price-asc') {
        // 价格升序
        goodsWithNumericPrice = [...goodsWithNumericPrice].sort((a, b) => a.price - b.price)
      } else if (sortBy === 'price-desc') {
        // 价格降序
        goodsWithNumericPrice = [...goodsWithNumericPrice].sort((a, b) => b.price - a.price)
      }

      setGoods(goodsWithNumericPrice)
      setTotal(response.total)
    } catch (err) {
      console.error('获取商品列表失败', err)
    } finally {
      setLoading(false)
    }
  }

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
    setPage(1)
    fetchGoodsList()
  }, [category, sortBy])

  useEffect(() => {
    if (page !== 1) {
      fetchGoodsList()
    }
  }, [page])

  useEffect(() => {
    fetchFavoriteIds()
  }, [userId])

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const sortButtons = [
    { key: 'default', label: '综合' },
    { key: 'sales', label: '销量' },
    { key: 'price-asc', label: '价格升序' },
    { key: 'price-desc', label: '价格降序' },
  ]

  return (
    <div
      style={{
        background: 'transparent',
        minHeight: 'calc(100vh - 200px)',
        padding: '24px 50px',
        position: 'relative',
        zIndex: 1,
      }}
      className="prd-page-content"
    >
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: '#8C8A87' }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: '#5E5B57' }}>商品列表</Breadcrumb.Item>
        {category && <Breadcrumb.Item style={{ color: '#2C2A28' }}>{category}</Breadcrumb.Item>}
        {keyword && <Breadcrumb.Item style={{ color: '#2C2A28' }}>搜索: {keyword}</Breadcrumb.Item>}
      </Breadcrumb>

      {/* 筛选和排序 - PRD风格 */}
      <Card style={{ marginBottom: '24px', borderRadius: '16px', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="middle">
            {sortButtons.map((btn) => (
              <Button
                key={btn.key}
                type={sortBy === btn.key ? 'primary' : 'text'}
                onClick={() => setSortBy(btn.key)}
                style={{
                  borderRadius: '20px',
                  padding: '0 20px',
                  height: '36px',
                  background: sortBy === btn.key ? '#D97A4A' : '#FAF9F8',
                  border: 'none',
                  color: sortBy === btn.key ? '#fff' : '#5E5B57',
                  fontWeight: sortBy === btn.key ? '500' : '400',
                }}
              >
                {btn.label}
              </Button>
            ))}
          </Space>
          <Space>
            <Text type="secondary" style={{ color: '#8C8A87', fontSize: '13px' }}>
              共 {total} 件商品
            </Text>
          </Space>
        </div>
      </Card>

      <Spin spinning={loading}>
        {goods.length === 0 && !loading ? (
          <Card style={{ borderRadius: '16px', border: 'none' }}>
            <Empty description="暂无商品" />
          </Card>
        ) : (
          <>
            <Row gutter={[20, 20]} style={{ marginBottom: '28px' }}>
              {goods.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.goods_id}>
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
                              <span style={{ fontSize: '80px', opacity: 0.6 }}>📱</span>
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
                            <Text style={{ fontSize: '14px', color: '#2C2A28', fontWeight: '500' }}>
                              {item.name}
                            </Text>
                          </div>
                        }
                        description={
                          <div>
                            <div className="prd-price" style={{ marginTop: '12px' }}>
                              ¥{item.price.toFixed(2)}
                            </div>
                            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                              <Text type="secondary" style={{ fontSize: '12px', color: '#A8A6A3' }}>
                                {Math.floor(Math.random() * 10000)}+ 人付款
                              </Text>
                              <Text type="secondary" style={{ fontSize: '12px', color: '#A8A6A3' }}>
                                广东深圳
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>

            {total > 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={setPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 件`}
                  style={{
                    '--primary-color': '#D97A4A',
                  } as React.CSSProperties}
                />
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  )
}

export default GoodsList
