import { useEffect, useState } from 'react'
import { Card, Row, Col, Typography, Button, Tag, Avatar } from 'antd'
import {
  ShoppingOutlined,
  WalletOutlined,
  GiftOutlined,
  CommentOutlined,
  StarOutlined,
  ArrowRightOutlined,
  UserOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '@/store'
import { fetchUserInfo } from '@/store/userSlice'
import { Link } from 'react-router-dom'
import { shopService } from '@/services/shopService'
import type { Order } from '@/types/order'
import type { OrderReturn } from '@/types/order'

const { Title, Text } = Typography

const ProfileHome = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.user)
  const [orderCounts, setOrderCounts] = useState({
    unpaid: 0,
    unreceived: 0,
    unreviewed: 0,
  })
  const [pendingReturnCount, setPendingReturnCount] = useState(0)

  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  // 获取订单列表并统计数量
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await shopService.getOrderList()
        const orderList = response.items || []

        // 统计各状态订单数量
        const counts = {
          unpaid: 0,
          unreceived: 0,
          unreviewed: 0,
        }

        orderList.forEach((order: Order) => {
          switch (order.status) {
            case 'pending_payment':
              counts.unpaid++
              break
            case 'pending_receipt':
              counts.unreceived++
              break
            case 'completed':
              // 已完成但未评价的订单（这里简化处理，所有已完成都算作待评价）
              counts.unreviewed++
              break
          }
        })

        setOrderCounts(counts)
      } catch (err) {
        console.error('获取订单列表失败', err)
      }
    }

    fetchOrders()
  }, [])

  // 获取退换货列表并统计待审核数量
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await shopService.getReturnList(1, 100)
        const returnList = response.items || []

        // 统计待审核的退换货申请数量
        const pendingCount = returnList.filter((item: OrderReturn) => item.status === 'pending').length
        setPendingReturnCount(pendingCount)
      } catch (err) {
        console.error('获取退换货列表失败', err)
      }
    }

    fetchReturns()
  }, [])

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

  // 点击快捷入口跳转到对应订单标签页
  const handleQuickActionClick = (tabKey: string | null, isReturns: boolean = false) => {
    if (tabKey) {
      if (isReturns) {
        navigate('/profile?tab=returns')
      } else {
        navigate('/profile?tab=orders&status=' + tabKey)
      }
    }
  }

  const quickActions = [
    {
      icon: <ShoppingOutlined />,
      title: '待付款',
      count: orderCounts.unpaid,
      color: '#1890ff',
      tabKey: 'unpaid',
      isReturns: false,
    },
    {
      icon: <WalletOutlined />,
      title: '待收货',
      count: orderCounts.unreceived,
      color: '#52c41a',
      tabKey: 'unreceived',
      isReturns: false,
    },
    {
      icon: <CommentOutlined />,
      title: '待评价',
      count: orderCounts.unreviewed,
      color: '#faad14',
      tabKey: 'unreviewed',
      isReturns: false,
    },
    {
      icon: <UndoOutlined />,
      title: '退换/售后',
      count: pendingReturnCount,
      color: '#722ed1',
      tabKey: 'returns',
      isReturns: true,
    },
  ]

  const orderStatuses = [
    { label: '待付款', key: 'unpaid' },
    { label: '待发货', key: 'unsent' },
    { label: '待收货', key: 'unreceived' },
    { label: '待评价', key: 'unreviewed' },
    { label: '退换/售后', key: 'refund' },
  ]

  // 点击订单状态入口
  const handleOrderStatusClick = (tabKey: string) => {
    navigate('/profile?tab=orders&status=' + tabKey)
  }

  return (
    <div>
      {/* 用户信息卡片 */}
      <Card style={{ marginBottom: 20, borderRadius: '16px', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size={80}
            src={getAvatarUrl()}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #D97A4A 0%, #C86B3A 100%)',
              marginRight: 24,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Title level={3} style={{ margin: 0, marginRight: 12, color: '#2C2A28', fontSize: '20px' }}>
                {user?.username || '用户'}
              </Title>
              <Tag color="#D97A4A" style={{ borderRadius: '10px' }}>普通会员</Tag>
            </div>
            <Text type="secondary" style={{ color: '#8C8A87' }}>
              注册时间：{user?.create_time ? new Date(user.create_time).toLocaleDateString() : '-'}
            </Text>
          </div>
          <Link to="/profile?tab=settings">
            <Button icon={<StarOutlined />} style={{ borderRadius: '20px' }}>
            </Button>
          </Link>
        </div>
      </Card>

      {/* 快捷入口 */}
      <Card style={{ marginBottom: 20, borderRadius: '16px', border: 'none' }}>
        <Row gutter={16}>
          {quickActions.map((action, index) => (
            <Col span={6} key={index}>
              <div
                onClick={() => handleQuickActionClick(action.tabKey, action.isReturns)}
                style={{
                  textAlign: 'center',
                  padding: '24px 0',
                  cursor: action.tabKey ? 'pointer' : 'default',
                  borderRadius: 12,
                  transition: 'all 0.3s',
                }}
                className={action.tabKey ? 'prd-address-item' : ''}
              >
                <div
                  style={{
                    fontSize: 32,
                    color: action.color === '#1890ff' ? '#D97A4A' :
                           action.color === '#52c41a' ? '#1890ff' :
                           action.color === '#faad14' ? '#faad14' :
                           action.color === '#722ed1' ? '#722ed1' : '#ff4d4f',
                    marginBottom: 12,
                  }}
                >
                  {action.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text strong style={{ fontSize: 20, color: action.color === '#1890ff' ? '#D97A4A' :
                           action.color === '#52c41a' ? '#1890ff' :
                           action.color === '#faad14' ? '#faad14' :
                           action.color === '#722ed1' ? '#722ed1' : '#ff4d4f', marginRight: 6, fontWeight: '600' }}>
                    {action.count}
                  </Text>
                  <Text type="secondary" style={{ color: '#5E5B57' }}>{action.title}</Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default ProfileHome
