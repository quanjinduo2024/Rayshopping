import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Row, Col, Card, Pagination, Typography, Spin, Empty, Breadcrumb, Space, Button, Select } from 'antd'
import { ShoppingOutlined, HomeOutlined, FilterOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { Goods } from '@/types/goods'

const { Title, Text } = Typography
const { Meta } = Card
const { Option } = Select

const GoodsList = () => {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  const [goods, setGoods] = useState<Goods[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [sortBy, setSortBy] = useState('default')

  // 模拟商品数据
  const mockGoods: Goods[] = [
    {
      goods_id: 1,
      name: 'iPhone 15 Pro Max 256GB 原色钛金属',
      price: 9999,
      intro: 'A17 Pro芯片，钛金属设计，专业级摄像系统',
      image_url: '',
      stock: 100,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 2,
      name: 'iPhone 15 Pro 128GB 黑色钛金属',
      price: 7999,
      intro: 'A17 Pro芯片，钛金属设计',
      image_url: '',
      stock: 150,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 3,
      name: 'MacBook Pro 14英寸 M3芯片',
      price: 14999,
      intro: 'M3芯片，Liquid Retina XDR显示屏，18小时续航',
      image_url: '',
      stock: 50,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 4,
      name: 'MacBook Air 15英寸 M2芯片',
      price: 10499,
      intro: 'M2芯片，15.3英寸显示屏，18小时续航',
      image_url: '',
      stock: 80,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 5,
      name: 'AirPods Pro 2代 USB-C',
      price: 1899,
      intro: '主动降噪，自适应通透模式，个性化空间音频',
      image_url: '',
      stock: 200,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 6,
      name: 'AirPods 3代',
      price: 1399,
      intro: '空间音频，抗汗防水，MagSafe充电盒',
      image_url: '',
      stock: 250,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 7,
      name: 'iPad Air 10.9英寸 M2芯片',
      price: 4799,
      intro: 'M2芯片，10.9英寸Liquid Retina显示屏',
      image_url: '',
      stock: 80,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 8,
      name: 'iPad Pro 12.9英寸 M2芯片',
      price: 9299,
      intro: 'M2芯片，12.9英寸Liquid Retina XDR显示屏',
      image_url: '',
      stock: 60,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 9,
      name: 'Apple Watch Series 9',
      price: 2999,
      intro: '健康监测，运动追踪，车祸检测',
      image_url: '',
      stock: 120,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 10,
      name: 'Apple Watch Ultra 2',
      price: 6499,
      intro: '极限运动，精密双频GPS，100米防水',
      image_url: '',
      stock: 40,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 11,
      name: 'Magic Keyboard 触控板',
      price: 899,
      intro: '无线蓝牙键盘，背光按键，触控板设计',
      image_url: '',
      stock: 150,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 12,
      name: 'HomePod mini 智能音箱',
      price: 749,
      intro: 'Siri智能助手，家庭中枢，智能家居控制',
      image_url: '',
      stock: 90,
      create_time: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    // 模拟 API 调用
    setLoading(true)
    setTimeout(() => {
      setGoods(mockGoods)
      setTotal(mockGoods.length)
      setLoading(false)
    }, 500)
  }, [page, sortBy, keyword])

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
                        <div
                          style={{
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                            fontSize: '80px',
                          }}
                        >
                          📱
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
