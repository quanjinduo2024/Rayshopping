import { useEffect } from 'react'
import { Card, Row, Col, Typography, Button, Space, Statistic, Tag, Divider, Avatar } from 'antd'
import {
  ShoppingOutlined,
  WalletOutlined,
  GiftOutlined,
  CommentOutlined,
  StarOutlined,
  ArrowRightOutlined,
  UserOutlined,
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

  const getAvatarUrl = () => {
    if (user?.avatar) {
      // 如果是相对路径，拼接完整URL
      if (user.avatar.startsWith('/')) {
        return `http://localhost:8001${user.avatar}`
      }
      return user.avatar
    }
    return ''
  }

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
          <Avatar
            size={80}
            src={getAvatarUrl()}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              marginRight: 24,
            }}
          />
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
    </div>
  )
}

export default ProfileHome
