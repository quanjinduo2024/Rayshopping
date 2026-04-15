import { Link } from 'react-router-dom'
import { Layout, Row, Col, Card, Carousel, Typography, Space, Button, List, Tag } from 'antd'
import { ShoppingOutlined, RightOutlined, FireOutlined, StarOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import type { Goods } from '@/types/goods'

const { Content, Sider } = Layout
const { Title, Paragraph, Text } = Typography
const { Meta } = Card

const Home = () => {
  // 模拟商品数据
  const hotProducts: Goods[] = [
    {
      goods_id: 1,
      name: 'iPhone 15 Pro Max 256GB 原色钛金属',
      price: 9999,
      intro: 'A17 Pro芯片，钛金属设计',
      image_url: '',
      stock: 100,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 2,
      name: 'MacBook Pro 14英寸 M3芯片',
      price: 14999,
      intro: 'M3芯片，Liquid Retina XDR显示屏',
      image_url: '',
      stock: 50,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 3,
      name: 'AirPods Pro 2代 USB-C',
      price: 1899,
      intro: '主动降噪，自适应通透模式',
      image_url: '',
      stock: 200,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 4,
      name: 'iPad Air 10.9英寸 M2芯片',
      price: 4799,
      intro: 'M2芯片，10.9英寸Liquid Retina显示屏',
      image_url: '',
      stock: 80,
      create_time: new Date().toISOString(),
    },
  ]

  const newProducts: Goods[] = [
    {
      goods_id: 5,
      name: 'Apple Watch Series 9',
      price: 2999,
      intro: '健康监测，运动追踪',
      image_url: '',
      stock: 120,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 6,
      name: 'Magic Keyboard 触控板',
      price: 899,
      intro: '无线蓝牙键盘，背光按键',
      image_url: '',
      stock: 150,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 7,
      name: 'HomePod mini 智能音箱',
      price: 749,
      intro: 'Siri智能助手，家庭中枢',
      image_url: '',
      stock: 90,
      create_time: new Date().toISOString(),
    },
    {
      goods_id: 8,
      name: 'AirTag 4件装',
      price: 779,
      intro: '物品追踪器，查找我的',
      image_url: '',
      stock: 200,
      create_time: new Date().toISOString(),
    },
  ]

  // 左侧分类菜单
  const categories = [
    { id: 1, name: '手机数码', icon: '📱' },
    { id: 2, name: '电脑办公', icon: '💻' },
    { id: 3, name: '家用电器', icon: '🏠' },
    { id: 4, name: '智能穿戴', icon: '⌚' },
    { id: 5, name: '智能家居', icon: '🏡' },
    { id: 6, name: '配件周边', icon: '🎧' },
    { id: 7, name: '食品生鲜', icon: '🍎' },
    { id: 8, name: '美妆个护', icon: '💄' },
    { id: 9, name: '母婴玩具', icon: '🧸' },
    { id: 10, name: '图书文具', icon: '📚' },
  ]

  // 轮播图数据
  const carouselImages = [
    { id: 1, title: '新品首发', subtitle: 'iPhone 15 Pro Max', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, title: '限时特惠', subtitle: 'MacBook Pro 直降1000', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, title: '会员专享', subtitle: 'AirPods Pro 免息分期', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  ]

  return (
    <Layout style={{ background: '#f5f5f5' }}>
      <Row style={{ padding: '20px 50px' }} gutter={20}>
        {/* 左侧分类菜单 */}
        <Col xs={24} md={5}>
          <Card
            className="jd-category-menu"
            style={{ padding: 0 }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={categories}
              renderItem={(item) => (
                <List.Item
                  className="jd-category-item"
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <span style={{ marginRight: '10px', fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.name}</span>
                  <RightOutlined style={{ marginLeft: 'auto', color: '#999' }} />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 中间轮播图 */}
        <Col xs={24} md={13}>
          <Carousel
            className="jd-carousel"
            autoplay
            dotPosition="bottom"
            style={{ borderRadius: '4px', overflow: 'hidden' }}
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
                    color: '#fff',
                  }}
                >
                  <Title level={2} style={{ color: '#fff', marginBottom: '10px' }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: '#fff', fontSize: '18px' }}>
                    {item.subtitle}
                  </Paragraph>
                  <Button type="primary" size="large" style={{ marginTop: '20px' }}>
                    立即查看
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>
        </Col>

        {/* 右侧用户信息 */}
        <Col xs={24} md={6}>
          <Card style={{ marginBottom: '20px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                <div style={{ marginTop: '10px' }}>
                  <Text strong>欢迎来到 Rayshopping</Text>
                </div>
              </div>
              <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Link to="/login">
                  <Button type="primary" ghost>登录</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">注册</Button>
                </Link>
              </Space>
            </Space>
          </Card>

          <Card title="快捷入口" style={{ marginBottom: '20px' }}>
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <Button type="text" block icon={<ShoppingOutlined />}>
                  我的订单
                </Button>
              </Col>
              <Col span={12}>
                <Button type="text" block icon={<StarOutlined />}>
                  我的收藏
                </Button>
              </Col>
              <Col span={12}>
                <Button type="text" block icon={<ShoppingCartOutlined />}>
                  购物车
                </Button>
              </Col>
              <Col span={12}>
                <Button type="text" block icon={<UserOutlined />}>
                  会员中心
                </Button>
              </Col>
            </Row>
          </Card>

          <Card title="秒杀活动">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tag color="red" icon={<FireOutlined />}>限时秒杀</Tag>
                <Text type="secondary">更多</Text>
              </div>
              <div style={{ background: '#fff1f0', padding: '15px', borderRadius: '4px' }}>
                <Text strong style={{ color: '#ff4d4f', fontSize: '16px' }}>
                  10:00 场即将开始
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  爆款商品5折起
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 热门商品 */}
      <div style={{ padding: '20px 50px' }}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
              <span>热销爆款</span>
              <Link to="/goods" style={{ marginLeft: 'auto', fontSize: '14px' }}>
                查看更多 <RightOutlined />
              </Link>
            </div>
          }
          style={{ marginBottom: '20px' }}
        >
          <Row gutter={[20, 20]}>
            {hotProducts.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.goods_id}>
                <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
                  <Card
                    hoverable
                    className="jd-product-card"
                    cover={
                      <div
                        style={{
                          height: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f5f5f5',
                          fontSize: '60px',
                        }}
                      >
                        📱
                      </div>
                    }
                  >
                    <Meta
                      title={
                        <div className="product-name" style={{ height: '44px', overflow: 'hidden' }}>
                          {item.name}
                        </div>
                      }
                      description={
                        <div>
                          <div className="jd-price" style={{ marginTop: '8px' }}>
                            ¥{item.price.toFixed(2)}
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            销量 {Math.floor(Math.random() * 10000)}+
                          </Text>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 新品上市 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
              <span>新品上市</span>
              <Link to="/goods" style={{ marginLeft: 'auto', fontSize: '14px' }}>
                查看更多 <RightOutlined />
              </Link>
            </div>
          }
        >
          <Row gutter={[20, 20]}>
            {newProducts.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.goods_id}>
                <Link to={`/goods/${item.goods_id}`} style={{ color: 'inherit' }}>
                  <Card
                    hoverable
                    className="jd-product-card"
                    cover={
                      <div
                        style={{
                          height: '180px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f5f5f5',
                          fontSize: '60px',
                        }}
                      >
                        ⌚
                      </div>
                    }
                  >
                    <Meta
                      title={
                        <div className="product-name" style={{ height: '44px', overflow: 'hidden' }}>
                          {item.name}
                        </div>
                      }
                      description={
                        <div>
                          <div className="jd-price" style={{ marginTop: '8px' }}>
                            ¥{item.price.toFixed(2)}
                          </div>
                          <Tag color="blue" style={{ fontSize: '12px' }}>
                            新品
                          </Tag>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* 底部服务 */}
      <div
        style={{
          background: '#fff',
          padding: '40px 50px',
          marginTop: '40px',
          borderTop: '1px solid #e8e8e8',
        }}
      >
        <Row gutter={40}>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚚</div>
            <Text strong>闪电配送</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              极速发货，次日送达
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💯</div>
            <Text strong>正品保障</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              100%正品，假一赔十
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔄</div>
            <Text strong>7天无理由</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              7天无理由退换货
            </Text>
          </Col>
          <Col span={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
            <Text strong>贴心服务</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              7x24小时客服在线
            </Text>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default Home
