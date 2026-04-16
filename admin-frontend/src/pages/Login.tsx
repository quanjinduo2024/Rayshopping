import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { adminService } from '../services/api'
import type { Admin } from '../types'

const { Title } = Typography

interface LoginProps {
  onLogin: (admin: Admin) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response = await adminService.login(values)
      localStorage.setItem('admin_token', response.access_token)
      localStorage.setItem('admin_info', JSON.stringify(response.admin))
      onLogin(response.admin)
      message.success('登录成功')
      navigate('/orders')
    } catch (err) {
      message.error('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAF9F8'
    }}>
      <Card style={{ width: 420, borderRadius: '20px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32, color: '#2C2A28', fontWeight: '600' }}>
          Rayshopping 管理后台
        </Title>
        <Form
          form={form}
          onFinish={handleLogin}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#C8C6C3' }} />}
              placeholder="用户名"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#C8C6C3' }} />}
              placeholder="密码"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                background: '#D97A4A',
                borderColor: '#D97A4A',
                borderRadius: '24px',
                height: '48px',
                fontWeight: '500'
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: '#A8A6A3', fontSize: '13px' }}>
          默认账号：admin / admin123
        </div>
      </Card>
    </div>
  )
}

export default Login
