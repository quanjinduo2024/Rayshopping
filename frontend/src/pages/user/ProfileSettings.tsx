import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, message, Upload, Avatar, Space, Divider } from 'antd'
import { SettingOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchUserInfo } from '@/store/userSlice'
import { userService } from '@/services/userService'

const { Title, Text } = Typography

const ProfileSettings = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.user)
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        phone: user.phone || '',
      })
    }
  }, [user, form])

  const handleUpdate = async (values: any) => {
    try {
      await userService.updateUser({ phone: values.phone })
      message.success('更新成功')
      dispatch(fetchUserInfo())
    } catch (err) {
      message.error('更新失败')
    }
  }

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功')
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj))
    } else if (info.file.status === 'error') {
      message.error('头像上传失败')
    }
  }

  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: () => {
      return false
    },
    onChange: handleAvatarChange,
  }

  return (
    <div>
      <Title level={4} style={{ marginTop: 0, marginBottom: 20 }}>
        <SettingOutlined style={{ marginRight: 8 }} />
        个人设置
      </Title>

      <Card title="头像设置" style={{ marginBottom: 20 }}>
        <Space size="large">
          <Avatar
            size={100}
            src={avatarUrl}
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            }}
          />
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {user?.username || '用户'}
            </Text>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                上传头像
              </Button>
            </Upload>
            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
              支持 JPG、PNG 格式，建议尺寸 200x200
            </Text>
          </div>
        </Space>
      </Card>

      <Divider />

      <Card title="基本信息">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          style={{ maxWidth: 400 }}
        >
          <Form.Item label="用户ID">
            <Input value={user?.user_id || ''} disabled />
          </Form.Item>
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="注册时间">
            <Input
              value={user?.create_time ? new Date(user.create_time).toLocaleString() : ''}
              disabled
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ProfileSettings
