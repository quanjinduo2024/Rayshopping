import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Typography, Card, Spin, message, Avatar, Space, Button } from 'antd'
import { UserOutlined, EyeOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { User } from '../types'

const { Title } = Typography

const UserList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await adminService.getUserList(page, 20)
      setUsers(response.items || [])
      setPagination((prev) => ({ ...prev, current: page, total: response.total || 0 }))
    } catch (err) {
      message.error('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(1)
  }, [])

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
    },
    {
      title: '用户',
      key: 'user',
      width: 180,
      render: (_: any, record: User) => (
        <Space>
          <Avatar
            size="small"
            src={record.avatar}
            icon={<UserOutlined />}
          />
          <span style={{ color: '#2C2A28' }}>
            {record.username}
          </span>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: any, record: User) => (
        <Link to={`/users/${record.user_id}`}>
          <Button size="small" icon={<EyeOutlined />} style={{ borderRadius: '12px' }}>
            查看
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600' }}>
          <UserOutlined style={{ marginRight: 8, color: '#D97A4A' }} />
          用户管理
        </Title>
      </div>

      <Card style={{ borderRadius: '16px', border: 'none' }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="user_id"
            pagination={{
              ...pagination,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个用户`,
              onChange: (page) => fetchUsers(page),
            }}
          />
        </Spin>
      </Card>
    </div>
  )
}

export default UserList
