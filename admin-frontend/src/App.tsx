import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout, Typography, Menu, Space } from 'antd'
import { ShoppingOutlined, ShopOutlined, UserOutlined, DashboardOutlined } from '@ant-design/icons'
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

const { Header, Content, Sider } = Layout
const { Title } = Typography

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('admin_token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

const AdminLayout = ({ admin }: { admin: Admin | null }) => {
  const location = useLocation()

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setAdmin} />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AdminLayout admin={admin} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
