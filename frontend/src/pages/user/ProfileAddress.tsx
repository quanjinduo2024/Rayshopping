import { useState } from 'react'
import { Card, Button, Empty, Typography, Modal, Form, Input, message } from 'antd'
import { EnvironmentOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ProfileAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setIsModalOpen(true)
  }

  const handleModalOk = async () => {
    try {
      await form.validateFields()
      message.success('添加成功（功能开发中）')
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      // 验证失败
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          收货地址
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增地址
        </Button>
      </div>

      <Card>
        <Empty
          description={
            <div>
              <Text type="secondary">暂无收货地址</Text>
              <br />
              <Button type="primary" style={{ marginTop: 16 }} onClick={handleAdd}>
                添加地址
              </Button>
            </div>
          }
        />
      </Card>

      <Modal
        title="新增收货地址"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="收货人"
            name="name"
            rules={[{ required: true, message: '请输入收货人' }]}
          >
            <Input placeholder="请输入收货人姓名" />
          </Form.Item>
          <Form.Item
            label="手机号码"
            name="phone"
            rules={[{ required: true, message: '请输入手机号码' }]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item
            label="详细地址"
            name="address"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input.TextArea placeholder="请输入详细地址" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfileAddress
