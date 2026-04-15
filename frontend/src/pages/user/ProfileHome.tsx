import { useEffect } from 'react'
import { Card, Row, Col, Typography, Button, Space, Statistic, Tag, Divider } from 'antd'
import {
  ShoppingOutlined,
  WalletOutlined,
  GiftOutlined,
  CommentOutlined,
  StarOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchUserInfo } from '@/store/userSlice'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

const ProfileHome = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  const quickActions = [
    {
      icon: <ShoppingOutlined />,
      title: '待付款',
      count: 0,
      color: '#1890ff',
    },
    {
      icon: <WalletOutlined />,
      title: '待收货',
      count: 0,
      color: '#52c41a',
    },
    {
      icon: <CommentOutlined />,
      title: '待评价',
      count: 0,
      color: '#faad14',
    },
    {
      icon: <GiftOutlined />,
      title: '优惠券',
      count: 0,
      color: '#ff4d4f',
    },
  ]

  const orderStatuses = [
    { label: '待付款', key: 'unpaid' },
    { label: '待发货', key: 'unsent' },
    { label: '待收货', key: 'unreceived' },
    { label: '待评价', key: 'unreviewed' },
    { label: '退换/售后', key: 'refund' },
  ]

  return (
    <div>
      {/* 用户信息卡片 */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: '#fff',
              marginRight: 24,
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Title level={3} style={{ margin: 0, marginRight: 12 }}>
                {user?.username || '用户'}
              </Title>
              <Tag color="blue">普通会员</Tag>
            </div>
            <Text type="secondary">
              注册时间：{user?.create_time ? new Date(user.create_time).toLocaleDateString() : '-'}
            </Text>
          </div>
          <Link to="/profile?tab=settings">
            <Button icon={<StarOutlined />}>
            </Button>
          </Link>
        </div>
      </Card>

      {/* 快捷入口 */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          {quickActions.map((action, index) => (
            <Col span={6} key={index}>
              <div
            style={{
              textAlign: 'center',
              padding: '20px 0',
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'all 0.3s',
              '&:hover': {
                background: '#f5f5f5',
              },
            }}
          >
            <div
              style={{
                fontSize: 28,
                color: action.color,
                marginBottom: 8,
              }}
            >
              {action.icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text strong style={{ fontSize: 18, color: action.color, marginRight: 4 }}>
                {action.count}
              </Text>
              <Text type="secondary">{action.title}</Text>
            </div>
          </div>
          </Col>
          ))}
        </Row>
      </Card>

      {/* 我的订单 */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>我的订单</span>
            <Link to="/profile?tab=orders" style={{ fontSize: 14 }}>
              全部订单 <ArrowRightOutlined />
            </Link>
          </div>
        }
        style={{ marginBottom: 20 }}
      >
        <Row gutter={16}>
          {orderStatuses.map((status) => (
            <Col span={24 / orderStatuses.length} key={status.key}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px 0',
                  cursor: 'pointer',
                }}
              >
                <Text>{status.label}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 功能推荐 */}
      <Card title="我的资产">
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="积分" value={0} suffix="分" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="余额" value={0} precision={2} prefix="¥" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Statistic title="红包" value={0} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default ProfileHome
