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

  return (
    <div style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 200px)', padding: '20px 50px' }}>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: '20px' }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>商品列表</Breadcrumb.Item>
        {category && <Breadcrumb.Item>{category}</Breadcrumb.Item>}
        {keyword && <Breadcrumb.Item>搜索: {keyword}</Breadcrumb.Item>}
      </Breadcrumb>

      {/* 筛选和排序 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button type={sortBy === 'default' ? 'primary' : 'default'} onClick={() => setSortBy('default')}>
              综合
            </Button>
            <Button type={sortBy === 'sales' ? 'primary' : 'default'} onClick={() => setSortBy('sales')}>
              销量
            </Button>
            <Button type={sortBy === 'price-asc' ? 'primary' : 'default'} onClick={() => setSortBy('price-asc')}>
              价格升序
            </Button>
            <Button type={sortBy === 'price-desc' ? 'primary' : 'default'} onClick={() => setSortBy('price-desc')}>
              价格降序
            </Button>
          </Space>
          <Space>
            <Text type="secondary">共 {total} 件商品</Text>
          </Space>
        </div>
      </Card>

      <Spin spinning={loading}>
        {goods.length === 0 && !loading ? (
          <Card>
            <Empty description="暂无商品" />
          </Card>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              {goods.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.goods_id}>
                  <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
                    <Card
                      hoverable
                      className="jd-product-card"
                      style={{ height: '100%' }}
                      cover={
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              height: '200px',
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
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span style={{ fontSize: '80px' }}>📱</span>
                            )}
                          </div>
                          <Button
                            type="text"
                            icon={
                              favoritedIds.includes(item.goods_id) ? (
                                <StarFilled style={{ color: '#faad14', fontSize: 18 }} />
                              ) : (
                                <StarOutlined style={{ color: '#fff', fontSize: 18, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
                              )
                            }
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              background: 'transparent',
                              border: 'none',
                              padding: 4,
                              minWidth: 'auto',
                              height: 'auto',
                            }}
                            onClick={(e) => handleToggleFavorite(item.goods_id, e)}
                          />
                        </div>
                      }
                    >
                      <Meta
                        title={
                          <div className="product-name" style={{ height: '44px', overflow: 'hidden', lineHeight: '22px' }}>
                            {item.name}
                          </div>
                        }
                        description={
                          <div>
                            <div className="jd-price" style={{ marginTop: '8px', fontSize: '20px' }}>
                              ¥{item.price.toFixed(2)}
                            </div>
                            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {Math.floor(Math.random() * 10000)}+ 人付款
                              </Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
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
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={setPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 件`}
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
