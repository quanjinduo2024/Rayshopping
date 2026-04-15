import { useState, useEffect } from 'react'
import { Card, Button, Empty, Typography, Modal, Form, Input, message, Space, Tag, Popconfirm } from 'antd'
import { EnvironmentOutlined, PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import type { Address, AddressRequest } from '@/types/user'

const { Title, Text } = Typography

const ProfileAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 模拟地址数据（实际项目中从 API 获取）
  const [addressList, setAddressList] = useState<Address[]>([
    {
      address_id: 1,
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路88号SOHO现代城A座1001室',
      is_default: true,
      create_time: new Date().toISOString(),
    },
    {
      address_id: 2,
      name: '李四',
      phone: '13900139000',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '陆家嘴金融中心B座2005室',
      is_default: false,
      create_time: new Date().toISOString(),
    },
  ])

  const handleAdd = () => {
    setEditingAddress(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    form.setFieldsValue({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      is_default: address.is_default,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (addressId: number) => {
    setLoading(true)
    setTimeout(() => {
      setAddressList(prev => prev.filter(item => item.address_id !== addressId))
      message.success('删除成功')
      setLoading(false)
    }, 500)
  }

  const handleSetDefault = (addressId: number) => {
    setLoading(true)
    setTimeout(() => {
      setAddressList(prev => prev.map(item => ({
        ...item,
        is_default: item.address_id === addressId,
      })))
      message.success('设置默认地址成功')
      setLoading(false)
    }, 500)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      setTimeout(() => {
        if (editingAddress) {
          // 编辑模式
          setAddressList(prev => prev.map(item => {
            if (item.address_id === editingAddress.address_id) {
              const updated = { ...item, ...values }
              // 如果设为默认，取消其他地址的默认状态
              if (values.is_default) {
                return { ...updated, is_default: true }
              }
              return updated
            }
            if (values.is_default) {
              return { ...item, is_default: false }
            }
            return item
          }))
          message.success('修改成功')
        } else {
          // 新增模式
          const newAddress: Address = {
            address_id: Date.now(),
            ...values,
            create_time: new Date().toISOString(),
          }
          setAddressList(prev => {
            // 如果设为默认，取消其他地址的默认状态
            if (values.is_default) {
              return [newAddress, ...prev.map(item => ({ ...item, is_default: false }))]
            }
            return [newAddress, ...prev]
          })
          message.success('添加成功')
        }

        setIsModalOpen(false)
        form.resetFields()
        setLoading(false)
      }, 500)
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

      {addressList.length === 0 ? (
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
      ) : (
        <div>
          {addressList.map((address) => (
            <Card
              key={address.address_id}
              style={{ marginBottom: 16 }}
              actions={[
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(address)}
                >
                  编辑
                </Button>,
                address.is_default ? null : (
                  <Button
                    type="link"
                    size="small"
                    icon={<HomeOutlined />}
                    onClick={() => handleSetDefault(address.address_id)}
                    loading={loading}
                  >
                    设为默认
                  </Button>
                ),
                <Popconfirm
                  title="确定要删除这个地址吗？"
                  onConfirm={() => handleDelete(address.address_id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    loading={loading}
                  >
                    删除
                  </Button>
                </Popconfirm>,
              ].filter(Boolean)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Space size="middle" style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 16 }}>{address.name}</Text>
                    <Text>{address.phone}</Text>
                    {address.is_default && <Tag color="blue">默认地址</Tag>}
                  </Space>
                  <Text>
                    {address.province} {address.city} {address.district} {address.detail}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingAddress ? '编辑收货地址' : '新增收货地址'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        width={500}
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
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入手机号码" maxLength={11} />
          </Form.Item>
          <Form.Item
            label="省/市/区"
            required
          >
            <Space>
              <Form.Item
                name="province"
                rules={[{ required: true, message: '请选择省份' }]}
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input placeholder="省份" />
              </Form.Item>
              <Form.Item
                name="city"
                rules={[{ required: true, message: '请选择城市' }]}
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input placeholder="城市" />
              </Form.Item>
              <Form.Item
                name="district"
                rules={[{ required: true, message: '请选择区县' }]}
                style={{ marginBottom: 0, flex: 1 }}
              >
                <Input placeholder="区县" />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item
            label="详细地址"
            name="detail"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input.TextArea placeholder="请输入详细地址，如街道、门牌号等" rows={3} />
          </Form.Item>
          <Form.Item
            name="is_default"
            valuePropName="checked"
          >
            <input type="checkbox" /> 设为默认地址
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfileAddress
