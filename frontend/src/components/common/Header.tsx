import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd'
import { ShoppingOutlined, UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { logout } from '@/store/userSlice'

const { Header: AntHeader } = Layout

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { userId, user } = useSelector((state: RootState) => state.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: <Link to="/orders">我的订单</Link>,
      icon: <ShoppingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/goods',
      label: <Link to="/goods">商品列表</Link>,
    },
  ]

  return (
    <AntHeader style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '48px' }}>
        <Link to="/" style={{ color: '#1890ff' }}>
          Rayshopping
        </Link>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />
      <Space>
        {userId ? (
          <>
            <Link to="/cart">
              <Button type="text" icon={<ShoppingCartOutlined />}>
                购物车
              </Button>
            </Link>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button type="text">登录</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">注册</Button>
            </Link>
          </>
        )}
      </Space>
    </AntHeader>
  )
}

export default Header
