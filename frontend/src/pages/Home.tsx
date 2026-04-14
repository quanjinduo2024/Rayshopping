import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Typography, Button, Row, Col, Card, Space } from 'antd'
import { ShoppingOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const Home = () => {
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1}>欢迎来到 Rayshopping</Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          基于微服务架构的现代化购物平台
        </Paragraph>
        <Space size="large">
          <Link to="/goods">
            <Button type="primary" size="large" icon={<ShoppingOutlined />}>
              浏览商品
            </Button>
          </Link>
        </Space>
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>用户模块</Title>
              <Paragraph>用户注册、登录、个人信息管理</Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <ShoppingOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={3}>购物模块</Title>
              <Paragraph>商品浏览、购物车、订单管理</Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <ShoppingCartOutlined style={{ fontSize: '48px', color: '#fa8c16', marginBottom: '16px' }} />
              <Title level={3">微服务架构</Title>
              <Paragraph>用户服务与购物服务分离</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
