import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/common/Header'
import Home from './pages/Home'
import Login from './pages/user/Login'
import Register from './pages/user/Register'
import Profile from './pages/user/Profile'
import GoodsList from './pages/shop/GoodsList'
import GoodsDetail from './pages/shop/GoodsDetail'
import Cart from './pages/shop/Cart'
import Checkout from './pages/shop/Checkout'
import OrderList from './pages/shop/OrderList'
import OrderDetail from './pages/shop/OrderDetail'
import PrivateRoute from './components/common/PrivateRoute'

const { Content, Footer } = Layout

function App() {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-6" style={{ minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/goods" element={<GoodsList />} />
          <Route path="/goods/:id" element={<GoodsDetail />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Rayshopping ©2024</Footer>
    </Layout>
  )
}

export default App
