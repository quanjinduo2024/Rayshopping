import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { register, clearError } from '@/store/userSlice'

const { Title, Text } = Typography

const Register = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, userId } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (userId) {
      navigate('/')
    }
  }, [userId, navigate])

  useEffect(() => {
    if (error) {
      message.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onFinish = async (values: any) => {
    try {
      await dispatch(register(values)).unwrap()
      message.success('注册成功')
    } catch (err) {
      // Error handled in effect
    }
  }

  return (
    <div className="prd-page-content" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <Card style={{ width: 420, borderRadius: '16px', border: 'none', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#2C2A28', fontWeight: '600' }}>用户注册</Title>
        </div>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input prefix={<UserOutlined style={{ color: '#8C8A87' }} />} placeholder="请输入用户名" style={{ borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#8C8A87' }} />} placeholder="请输入密码" style={{ borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#8C8A87' }} />} placeholder="请再次输入密码" style={{ borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item name="phone">
            <Input prefix={<PhoneOutlined style={{ color: '#8C8A87' }} />} placeholder="手机号（可选）" style={{ borderRadius: '10px' }} />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px', height: '48px', fontSize: '16px', fontWeight: '500' }}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#8C8A87' }}>
            已有账号？ <Link to="/login" style={{ color: '#D97A4A', fontWeight: '500' }}>立即登录</Link>
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default Register
