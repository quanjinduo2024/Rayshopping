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
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>用户登录</Title>
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
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Text>
            还没有账号？ <Link to="/register">立即注册</Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default Login
