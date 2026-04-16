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
      label: <Link to="/profile?tab=favorites">我的收藏</Link>,
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

  const navItems = [
    { key: 'home', label: '首页', path: '/' },
    { key: 'goods', label: '商品分类', path: '/goods' },
    { key: 'flash', label: '闪购', path: '/goods?tag=flash' },
    { key: 'new', label: '新品', path: '/goods?sort=new' },
    { key: 'hot', label: '热卖', path: '/goods?sort=hot' },
  ]

  return (
    <>
      {/* 统一顶栏容器 */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #EFEDEA',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* 顶部小条 - 用户信息 */}
        <div
          style={{
            background: '#FAF9F8',
            padding: '0 50px',
            height: '32px',
            lineHeight: '32px',
            fontSize: '12px',
            borderBottom: '1px solid #EFEDEA',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ color: '#A8A6A3' }}>
              欢迎来到 Rayshopping！
            </Text>
            <Space size="middle" split={<span style={{ color: '#E8E6E3' }}>|</span>}>
              {userId ? (
                <>
                  <Space size="small">
                    <Avatar
                      size={16}
                      src={getAvatarUrl()}
                      icon={<UserOutlined />}
                      style={{
                        background: 'linear-gradient(135deg, #D97A4A 0%, #C86B3A 100%)',
                      }}
                    />
                    <Text style={{ color: '#5E5B57' }}>
                      Hi, {user?.username || '用户'}
                    </Text>
                  </Space>
                  <Link to="/orders" style={{ color: '#5E5B57' }}>我的订单</Link>
                  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <span style={{ cursor: 'pointer', color: '#5E5B57' }}>会员中心</span>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ color: '#5E5B57' }}>你好，请登录</Link>
                  <Link to="/register" style={{ color: '#D97A4A' }}>
                    免费注册
                  </Link>
                </>
              )}
            </Space>
          </div>
        </div>

        {/* 主Header - 搜索栏居中布局 */}
        <AntHeader
          style={{
            padding: '0 50px',
            height: '72px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            {/* 左侧：Logo + 导航 */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {/* Logo 区域 */}
              <Link to="/" style={{ marginRight: '40px', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#2C3E2F',
                    letterSpacing: '0.5px',
                  }}
                >
                  Rayshopping
                </div>
              </Link>

              {/* 导航菜单 */}
              <Space size="large" style={{ flexShrink: 0 }}>
                {navItems.map((item) => {
                  const isActive =
                    (item.key === 'home' && location.pathname === '/') ||
                    (item.key === 'goods' && location.pathname === '/goods' && !location.search) ||
                    (item.key === 'flash' && location.search.includes('tag=flash')) ||
                    (item.key === 'new' && location.search.includes('sort=new')) ||
                    (item.key === 'hot' && location.search.includes('sort=hot'))

                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      style={{
                        color: isActive ? '#D97A4A' : '#5E5B57',
                        fontSize: '15px',
                        fontWeight: isActive ? '600' : '400',
                        position: 'relative',
                        padding: '6px 0',
                        transition: 'all 0.2s',
                      }}
                    >
                      {item.label}
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '0px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '24px',
                            height: '2px',
                            background: '#D97A4A',
                            borderRadius: '1px',
                          }}
                        />
                      )}
                    </Link>
                  )
                })}
              </Space>
            </div>

            {/* 中间：搜索栏居中 */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {/* 搜索框 - 独立设计，无边框错位 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#FAF9F8',
                  borderRadius: '24px',
                  padding: '4px',
                }}
              >
                <Input
                  placeholder="搜索商品"
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={() => handleSearch(searchText)}
                  style={{
                    width: '420px',
                    background: '#fff',
                    borderRadius: '20px 0 0 20px',
                    border: 'none',
                    boxShadow: 'none',
                    height: '36px',
                    padding: '0 16px',
                  }}
                />
                <Button
                  type="primary"
                  style={{
                    background: '#D97A4A',
                    borderColor: '#D97A4A',
                    borderRadius: '0 20px 20px 0',
                    height: '36px',
                    padding: '0 20px',
                    marginLeft: '-1px',
                  }}
                  icon={<SearchOutlined />}
                  onClick={() => handleSearch(searchText)}
                />
              </div>
            </div>

            {/* 右侧：购物车 */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Link to={userId ? '/cart' : '/login'}>
                <Button
                  style={{
                    borderRadius: '20px',
                    background: '#FAF9F8',
                    border: 'none',
                    height: '40px',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  icon={
                    <Badge
                      count={userId ? cartCount : 0}
                      size="small"
                      style={{ background: '#D97A4A' }}
                    >
                      <ShoppingCartOutlined style={{ color: '#5E5B57', fontSize: '18px' }} />
                    </Badge>
                  }
                >
                  <span style={{ color: '#5E5B57', fontSize: '14px' }}>购物车</span>
                </Button>
              </Link>
            </div>
          </div>
        </AntHeader>
      </div>
    </>
  )
}

export default Header
