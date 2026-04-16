import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Typography } from 'antd'
import Login from './pages/Login'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import { useState, useEffect } from 'react'
import type { Admin } from './types'

const { Header, Content, Sider } = Layout
const { Title } = Typography

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('admin_token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
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
              <Layout style={{ minHeight: '100vh' }}>
                <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
                  <Title level={3} style={{ color: '#fff', margin: 0, flex: 1 }}>
                    Rayshopping 管理后台
                  </Title>
                  {admin && (
                    <div style={{ color: '#fff' }}>
                      管理员：{admin.username}
                    </div>
                  )}
                </Header>
                <Content style={{ padding: '24px' }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/orders" replace />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                  </Routes>
                </Content>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
