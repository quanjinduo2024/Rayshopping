import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Typography, Menu, Space, Button, message } from 'antd'
import { ShoppingOutlined, ShopOutlined, UserOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons'
import Login from './pages/Login'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import GoodsList from './pages/GoodsList'
import GoodsEdit from './pages/GoodsEdit'
import Dashboard from './pages/Dashboard'
import UserList from './pages/UserList'
import UserDetail from './pages/UserDetail'
import { useState, useEffect } from 'react'
import type { Admin } from './types'
import { adminService } from './services/api'

const { Header, Content, Sider } = Layout
const { Title } = Typography

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('admin_token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

const AdminLayout = ({ admin, onLogout }: { admin: Admin | null, onLogout: () => void }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '数据概览',
    },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: '订单管理',
    },
    {
      key: '/goods',
      icon: <ShopOutlined />,
      label: '商品管理',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
  ]

  const handleLogout = () => {
    onLogout()
    message.success('退出成功')
    navigate('/login')
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#FAF9F8' }}>
      <Header style={{ background: '#fff', padding: '0 32px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #EFEDEA', height: '64px' }}>
        <Title level={3} style={{ color: '#2C2A28', margin: 0, flex: 1, fontWeight: '600' }}>
          Rayshopping 管理后台
        </Title>
        {admin && (
          <Space>
            <UserOutlined style={{ color: '#D97A4A' }} />
            <span style={{ color: '#5E5B57' }}>管理员：{admin.username}</span>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#8E8B87' }}
            >
              退出登录
            </Button>
          </Space>
        )}
      </Header>
      <Layout>
        <Sider width={220} style={{ background: '#fff', borderRight: '1px solid #EFEDEA' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ border: 'none', paddingTop: '16px' }}
            onClick={({ key }) => {
              window.location.href = key
            }}
          />
        </Sider>
        <Content style={{ padding: '0' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/goods" element={<GoodsList />} />
            <Route path="/goods/:id" element={<GoodsEdit />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetail />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

const App = () => {
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    const adminInfo = localStorage.getItem('admin_info')
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    setAdmin(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setAdmin} />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminLayout admin={admin} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
