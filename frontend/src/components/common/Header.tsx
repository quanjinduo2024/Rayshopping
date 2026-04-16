import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Input, Button, Space, Dropdown, Badge, Typography, Avatar } from 'antd'
import {
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  HomeOutlined,
  HeartOutlined,
  OrderedListOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { logout } from '@/store/userSlice'
import { fetchCartList } from '@/store/cartSlice'

const { Header: AntHeader } = Layout
const { Text } = Typography
const { Search } = Input

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { userId, user } = useSelector((state: RootState) => state.user)
  const { items } = useSelector((state: RootState) => state.cart)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartList())
    }
  }, [userId, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/goods?keyword=${encodeURIComponent(value)}`)
    }
  }

  const getAvatarUrl = () => {
    if (user?.avatar) {
      if (user.avatar.startsWith('/')) {
        return `http://localhost:8001${user.avatar}`
      }
      return user.avatar
    }
    return ''
  }

  const cartCount = items.filter((item) => item.checked).length

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">我的主页</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: <Link to="/orders">我的订单</Link>,
      icon: <OrderedListOutlined />,
    },
    {
      key: 'favorites',
      label: '我的关注',
      icon: <HeartOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'settings',
      label: <Link to="/profile?tab=settings">账户设置</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  const topMenuItems = [
    { key: 'home', label: <Link to="/">首页</Link>, icon: <HomeOutlined /> },
    { key: 'goods', label: <Link to="/goods">商品分类</Link> },
    { key: 'flash', label: '闪购' },
    { key: 'new', label: '新品' },
    { key: 'hot', label: '热卖' },
  ]

  return (
    <>
      {/* 顶部通栏 */}
      <div
        style={{
          background: '#f5f5f5',
          borderBottom: '1px solid #e8e8e8',
          padding: '0 50px',
          height: '30px',
          lineHeight: '30px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space size="middle">
            <Text type="secondary">欢迎来到 Rayshopping！</Text>
          </Space>
          <Space size="middle">
            {userId ? (
              <>
                <Space size="small">
                  <Avatar
                    size={20}
                    src={getAvatarUrl()}
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    }}
                  />
                  <Text type="secondary">
                    Hi, {user?.username || '用户'}
                  </Text>
                </Space>
                <Link to="/orders">我的订单</Link>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Link to="/profile">会员中心</Link>
                </Dropdown>
              </>
            ) : (
              <>
                <Link to="/login">你好，请登录</Link>
                <Link to="/register" style={{ color: '#1890ff' }}>
                  免费注册
                </Link>
              </>
            )}
          </Space>
        </div>
      </div>

      {/* 主导航 */}
      <AntHeader
        className="jd-header"
        style={{
          padding: '10px 50px',
          height: 'auto',
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ marginRight: '40px' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1890ff',
                letterSpacing: '2px',
              }}
            >
              Rayshopping
            </div>
          </Link>

          {/* 搜索框 */}
          <div style={{ flex: 1, maxWidth: '600px', marginRight: '40px' }}>
            <Search
              placeholder="搜索商品"
              allowClear
              enterButton={
                <Button type="primary" className="jd-search-btn" icon={<SearchOutlined />}>
                  搜索
                </Button>
              }
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
            />
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <Space>
                <Text type="secondary">热门搜索：</Text>
                <Link to="/goods" style={{ color: '#666' }}>
                  iPhone
                </Link>
                <Link to="/goods" style={{ color: '#666' }}>
                  MacBook
                </Link>
                <Link to="/goods" style={{ color: '#666' }}>
                  耳机
                </Link>
                <Link to="/goods" style={{ color: '#1890ff' }}>
                  更多
                </Link>
              </Space>
            </div>
          </div>

          {/* 购物车 */}
          <Link to={userId ? '/cart' : '/login'}>
            <Button
              size="large"
              icon={
                <Badge count={userId ? cartCount : 0} size="small">
                  <ShoppingCartOutlined />
                </Badge>
              }
            >
              购物车
            </Button>
          </Link>
        </div>
      </AntHeader>

      {/* 分类导航 */}
      <div
        style={{
          background: '#1890ff',
          padding: '0 50px',
          height: '40px',
          lineHeight: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 全部商品分类 */}
          <div
            style={{
              width: '200px',
              background: '#096dd9',
              padding: '0 15px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <ShoppingOutlined style={{ marginRight: '8px' }} />
            全部商品分类
          </div>

          {/* 导航菜单 */}
          <Space size="large" style={{ marginLeft: '30px' }}>
            {topMenuItems.map((item) => {
              const targetPath = item.key === 'home' ? '/' : item.key === 'goods' ? '/goods' : '#'
              const isActive = location.pathname === targetPath
              return (
                <Link
                  key={item.key}
                  to={targetPath}
                  style={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: isActive ? 'bold' : 'normal',
                    textShadow: isActive ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon} {item.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '24px',
                        height: '3px',
                        background: '#ffffff',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </Space>
        </div>
      </div>
    </>
  )
}

export default Header
