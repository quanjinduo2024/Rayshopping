import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, message, Divider, Progress, Tag, Row, Col } from 'antd'
import { SafetyOutlined, LockOutlined, PhoneOutlined, UserOutlined, IdcardOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { logout } from '@/store/userSlice'
import { userService } from '@/services/userService'

const { Title, Text } = Typography

const ProfileSecurity = () => {
  const [passwordForm] = Form.useForm()
  const [phoneForm] = Form.useForm()
  const [realNameForm] = Form.useForm()
  const { user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // 验证码倒计时
  useEffect(() => {
    let timer: number | null = null
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

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
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    try {
      const phone = phoneForm.getFieldValue('newPhone')
      if (!phone) {
        message.error('请先输入手机号')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        message.error('请输入正确的手机号码')
        return
      }
      setLoading(true)
      try {
        await userService.sendVerificationCode(phone)
        message.success('验证码已发送')
        setCountdown(60)
      } catch (error) {
        message.error('发送验证码失败')
      }
    } catch (error) {
      // Error already handled
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneUpdate = async (values: any) => {
    setLoading(true)
    try {
      await userService.updatePhone({
        phone: values.newPhone,
        code: values.code
      })
      message.success('手机号绑定成功')
      phoneForm.resetFields()
    } catch (error) {
      message.error('手机号绑定失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRealNameVerify = async (values: any) => {
    setLoading(true)
    try {
      await userService.verifyRealName(values)
      message.success('实名认证提交成功，等待审核')
      realNameForm.resetFields()
    } catch (error) {
      message.error('实名认证提交失败')
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
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <LockOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
              <div>
                <Text strong>登录密码</Text>
                <br />
                <Tag color="success">已设置</Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
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
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <IdcardOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 8 }} />
              <div>
                <Text strong>实名认证</Text>
                <br />
                <Tag color="warning">未认证</Tag>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 登录密码 */}
      <Card title={<><LockOutlined style={{ marginRight: 8 }} />登录密码</>} style={{ marginBottom: 20 }}>
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

      <Divider />

      {/* 绑定手机 */}
      <Card title={<><PhoneOutlined style={{ marginRight: 8 }} />{user?.phone ? '修改手机' : '绑定手机'}</>} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 20 }}>
          {user?.phone ? (
            <Text type="secondary">当前绑定手机：{user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
          ) : (
            <Text type="secondary">绑定手机后，可以使用手机号登录和找回密码</Text>
          )}
        </div>
        <Form
          form={phoneForm}
          layout="vertical"
          onFinish={handlePhoneUpdate}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="新手机号"
            name="newPhone"
            rules={[
              { required: true, message: '请输入新手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入新手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            label="验证码"
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '请输入6位验证码' },
            ]}
          >
            <div style={{ display: 'flex' }}>
              <Input
                style={{ flex: 1, marginRight: 12 }}
                placeholder="请输入6位验证码"
                maxLength={6}
              />
              <Button
                onClick={handleSendCode}
                disabled={countdown > 0 || loading}
                loading={loading}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Button>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {user?.phone ? '修改手机' : '绑定手机'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      {/* 实名认证 */}
      <Card title={<><UserOutlined style={{ marginRight: 8 }} />实名认证</>}>
        <div style={{ marginBottom: 20 }}>
          <Text type="secondary">实名认证后可享受更多服务，保障账户安全</Text>
        </div>
        <Form
          form={realNameForm}
          layout="vertical"
          onFinish={handleRealNameVerify}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="真实姓名"
            name="realName"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入身份证上的真实姓名" />
          </Form.Item>
          <Form.Item
            label="身份证号"
            name="idCard"
            rules={[
              { required: true, message: '请输入身份证号' },
              {
                pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                message: '请输入正确的身份证号',
              },
            ]}
          >
            <Input placeholder="请输入18位身份证号" maxLength={18} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交认证
            </Button>
          </Form.Item>
          <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <IdcardOutlined style={{ marginRight: 4 }} />
              温馨提示：您的身份信息仅用于实名认证，我们会严格保密，请放心填写
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileSecurity
