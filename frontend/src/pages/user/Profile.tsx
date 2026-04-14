import { useEffect } from 'react'
import { Card, Descriptions, Typography, Form, Input, Button, message, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchUserInfo } from '@/store/userSlice'
import { userService } from '@/services/userService'

const { Title } = Typography

const Profile = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.user)

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

  return (
    <div>
      <Title level={2}>个人中心</Title>
      <Card>
        {user && (
          <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
            <Descriptions.Item label="用户ID">{user.user_id}</Descriptions.Item>
            <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
            <Descriptions.Item label="手机号">{user.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{new Date(user.create_time).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新信息
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Profile
