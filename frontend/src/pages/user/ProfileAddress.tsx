import { useState, useEffect } from 'react'
import { Card, Button, Empty, Typography, Modal, Form, Input, message, Space, Tag, Popconfirm, Cascader, Checkbox } from 'antd'
import { EnvironmentOutlined, PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import type { Address, AddressRequest } from '@/types/user'
import { userService } from '@/services/userService'
import regionData from '@/utils/regionData'

const { Title, Text } = Typography

const ProfileAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [addressList, setAddressList] = useState<Address[]>([])

  // 获取地址列表
  const fetchAddressList = async () => {
    setFetchLoading(true)
    try {
      const list = await userService.getAddressList()
      setAddressList(list)
    } catch (error) {
      message.error('获取地址列表失败')
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    fetchAddressList()
  }, [])

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
      region: [address.province, address.city, address.district],
      detail: address.detail,
      is_default: address.is_default,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (addressId: number) => {
    setLoading(true)
    try {
      await userService.deleteAddress(addressId)
      message.success('删除成功')
      await fetchAddressList()
    } catch (error) {
      message.error('删除失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (addressId: number) => {
    setLoading(true)
    try {
      await userService.setDefaultAddress(addressId)
      message.success('设置默认地址成功')
      await fetchAddressList()
    } catch (error) {
      message.error('设置默认地址失败')
    } finally {
      setLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 处理省市区数据
      const [province, city, district] = values.region || []
      const addressData = {
        name: values.name,
        phone: values.phone,
        province,
        city,
        district,
        detail: values.detail,
        is_default: values.is_default || false,
      }

      if (editingAddress) {
        // 编辑模式
        await userService.updateAddress(editingAddress.address_id, addressData)
        message.success('修改成功')
      } else {
        // 新增模式
        await userService.addAddress(addressData)
        message.success('添加成功')
      }

      setIsModalOpen(false)
      form.resetFields()
      await fetchAddressList()
    } catch (error) {
      message.error(editingAddress ? '修改失败' : '添加失败')
    } finally {
      setLoading(false)
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
            name="region"
            rules={[{ required: true, message: '请选择省/市/区' }]}
          >
            <Cascader
              options={regionData}
              placeholder="请选择省/市/区"
              showSearch={{
                filter: (inputValue, path) =>
                  path.some(
                    (option) =>
                      (option.label as string)
                        .toLowerCase()
                        .indexOf(inputValue.toLowerCase()) > -1
                  ),
              }}
              style={{ width: '100%' }}
            />
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
            initialValue={false}
          >
            <Checkbox>设为默认地址</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfileAddress
