import { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Divider, Progress, Tag, Row, Col } from 'antd'
import { SafetyOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { logout } from '@/store/userSlice'
import { userService } from '@/services/userService'

const { Title, Text } = Typography

const ProfileSecurity = () => {
  const [passwordForm] = Form.useForm()
  const { user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // 检测密码强度
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (!password) {
      setPasswordStrength(0)
      return
    }
    if (password.length >= 6) strength += 25
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    setPasswordStrength(Math.min(strength, 100))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return '#ff4d4f'
    if (passwordStrength < 60) return '#faad14'
    if (passwordStrength < 80) return '#52c41'
    return '#1890ff'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '请输入密码'
    if (passwordStrength < 30) return '弱'
    if (passwordStrength < 60) return '中'
    if (passwordStrength < 80) return '强'
    return '非常强'
  }

  const handlePasswordUpdate = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    if (values.newPassword.length < 6) {
      message.error('新密码长度不能少于6位')
      return
    }
    setLoading(true)
    try {
      await userService.updatePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword
      })
      message.success('密码修改成功，请重新登录')
      passwordForm.resetFields()
      setPasswordStrength(0)
      // 退出登录
      setTimeout(() => {
        dispatch(logout())
        window.location.href = '/login'
      }, 1500)
    } catch (error: any) {
      console.error('修改密码失败:', error)
      message.error(error.response?.data?.detail || '密码修改失败，请检查当前密码是否正确')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Title level={4} style={{ marginTop: 0, marginBottom: 20 }}>
        <SafetyOutlined style={{ marginRight: 8 }} />
        账户安全
      </Title>

      {/* 账户安全概览 */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <LockOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
              <div>
                <Text strong>登录密码</Text>
                <br />
                <Tag color="success">已设置</Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <PhoneOutlined style={{ fontSize: 32, color: user?.phone ? '#52c41a' : '#faad14', marginBottom: 8 }} />
              <div>
                <Text strong>绑定手机</Text>
                <br />
                {user?.phone ? (
                  <Tag color="success">已绑定</Tag>
                ) : (
                  <Tag color="warning">未绑定</Tag>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 登录密码 */}
      <Card title={<><LockOutlined style={{ marginRight: 8 }} />登录密码</>}>
        <div style={{ marginBottom: 20 }}>
          <Text type="secondary">定期修改密码可以有效保护账户安全</Text>
        </div>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordUpdate}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password
              placeholder="请输入新密码（建议6位以上，包含字母和数字）"
              onChange={(e) => checkPasswordStrength(e.target.value)}
            />
          </Form.Item>
          {passwordStrength > 0 && (
            <Form.Item label="密码强度">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Progress
                  percent={passwordStrength}
                  strokeColor={getPasswordStrengthColor()}
                  showInfo={false}
                  style={{ flex: 1, marginRight: 12 }}
                  size="small"
                />
                <Text style={{ color: getPasswordStrengthColor(), minWidth: 60 }}>
                  {getPasswordStrengthText()}
                </Text>
              </div>
            </Form.Item>
          )}
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请再次输入新密码' }]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileSecurity
