import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, message, Upload, Avatar, Space, Divider } from 'antd'
import { SettingOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchUserInfo } from '@/store/userSlice'
import { userService } from '@/services/userService'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'

const { Title, Text } = Typography

const ProfileSettings = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.user)
  const [avatarLoading, setAvatarLoading] = useState(false)

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

  const handleAvatarUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件!')
      return Upload.LIST_IGNORE
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB!')
      return Upload.LIST_IGNORE
    }

    setAvatarLoading(true)
    try {
      const result = await userService.uploadAvatar(file)
      // 上传成功后更新用户头像
      await userService.updateAvatar({ avatar: result.avatar_url })
      message.success('头像更新成功')
      // 刷新用户信息
      dispatch(fetchUserInfo())
    } catch (error: any) {
      message.error(error.response?.data?.detail || '头像上传失败')
    } finally {
      setAvatarLoading(false)
    }
    return false // 阻止默认上传行为
  }

  const getAvatarUrl = () => {
    if (user?.avatar) {
      // 如果是相对路径，拼接完整URL
      if (user.avatar.startsWith('/')) {
        return `http://localhost:8001${user.avatar}`
      }
      return user.avatar
    }
    return ''
  }

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload: handleAvatarUpload,
    customRequest: () => {
      // 空实现，因为我们在 beforeUpload 中处理了
    },
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
            src={getAvatarUrl()}
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
              <Button icon={<UploadOutlined />} loading={avatarLoading}>
                上传头像
              </Button>
            </Upload>
            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
              支持 JPG、PNG 格式，建议尺寸 200x200，大小不超过 5MB
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
