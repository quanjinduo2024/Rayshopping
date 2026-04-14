import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Card, Pagination, Typography, Spin, Empty } from 'antd'
import { ShoppingOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { Goods } from '@/types/goods'

const { Title } = Typography
const { Meta } = Card

const GoodsList = () => {
  const [goods, setGoods] = useState<Goods[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)

  const fetchGoods = async (currentPage = 1) => {
    setLoading(true)
    try {
      const response = await shopService.getGoodsList(currentPage, pageSize)
      setGoods(response.items)
      setTotal(response.total)
    } catch (err) {
      console.error('获取商品列表失败', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoods(page)
  }, [page])

  return (
    <div>
      <Title level={2}>商品列表</Title>
      <Spin spinning={loading}>
        {goods.length === 0 && !loading ? (
          <Empty description="暂无商品" />
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {goods.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.goods_id}>
                  <Link to={`/goods/${item.goods_id}`}>
                    <Card
                      hoverable
                      cover={
                        <div
                          style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                          }}
                        >
                          <ShoppingOutlined style={{ fontSize: 48, color: '#999' }} />
                        </div>
                      }
                    >
                      <Meta title={item.name} description={`¥${item.price.toFixed(2)}`} />
                      <p style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                        {item.intro || '暂无描述'}
                      </p>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
            {total > 0 && (
              <div style={{ textAlign: 'center' }}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={setPage}
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
