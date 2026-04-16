import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { login, clearError } from '@/store/userSlice'

const { Title, Text } = Typography

const Login = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, userId } = useSelector((state: RootState) => state.user)

  const from = (location.state as any)?.from?.pathname || '/'

  useEffect(() => {
    if (userId) {
      navigate(from, { replace: true })
    }
  }, [userId, navigate, from])

  useEffect(() => {
    if (error) {
      message.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onFinish = async (values: any) => {
    try {
      await dispatch(login(values)).unwrap()
      message.success('登录成功')
    } catch (err) {
      // Error handled in effect
    }
  }

  return (
    <div className="prd-page-content" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <Card style={{ width: 420, borderRadius: '16px', border: 'none', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#2C2A28', fontWeight: '600' }}>用户登录</Title>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#8C8A87' }} />} placeholder="请输入用户名" style={{ borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#8C8A87' }} />} placeholder="请输入密码" style={{ borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px', height: '48px', fontSize: '16px', fontWeight: '500' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#8C8A87' }}>
            还没有账号？ <Link to="/register" style={{ color: '#D97A4A', fontWeight: '500' }}>立即注册</Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default Login
