import { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd'
import { SafetyOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const { Title, Text } = Typography

const ProfileSecurity = () => {
  const [passwordForm] = Form.useForm()
  const [phoneForm] = Form.useForm()
  const { user } = useSelector((state: RootState) => state.user)

  const handlePasswordUpdate = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }
    message.success('密码修改功能开发中')
  }

  const handlePhoneUpdate = async () => {
    message.success('手机号修改功能开发中')
  }

  return (
    <div>
      <Title level={4} style={{ marginTop: 0, marginBottom: 20 }}>
        <SafetyOutlined style={{ marginRight: 8 }} />
        账户安全
      </Title>

      {/* 登录密码 */}
      <Card title="登录密码" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <LockOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Text strong>当前密码强度：</Text>
            <Text type="secondary">未设置</Text>
          </div>
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
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请再次输入新密码' }]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      {/* 绑定手机 */}
      <Card title="绑定手机">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            <Text strong>当前绑定手机：</Text>
            <Text type="secondary">{user?.phone || '未绑定'}</Text>
          </div>
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
            rules={[{ required: true, message: '请输入新手机号' }]}
          >
            <Input placeholder="请输入新手机号" />
          </Form.Item>
          <Form.Item
            label="验证码"
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex' }}>
              <Input style={{ flex: 1, marginRight: 12 }} placeholder="请输入验证码" />
              <Button>获取验证码</Button>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              绑定手机
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileSecurity
