import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Spin, Button, Row, Col, Avatar, Tag, Space, Divider } from 'antd'
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { User } from '../types'

const { Title, Text } = Typography

const UserDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchUserDetail = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await adminService.getUserDetail(parseInt(id))
      setUser(data)
    } catch (err) {
      message.error('获取用户详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetail()
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', background: '#FAF9F8', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ padding: '100px 50px', background: '#FAF9F8', minHeight: '100vh' }}>
        <Title level={4}>用户不存在</Title>
        <Button
          type="primary"
          style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px', marginTop: '16px' }}
          onClick={() => navigate('/users')}
        >
          返回用户列表
        </Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          style={{ borderRadius: '12px', marginRight: 16 }}
          onClick={() => navigate('/users')}
        >
          返回
        </Button>
        <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600' }}>
          用户详情
        </Title>
      </div>

      <Row gutter={20}>
        <Col xs={24} md={8}>
          <Card title={<span style={{ color: '#2C2A28', fontWeight: '600' }}>基本信息</span>} style={{ borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar
                size={120}
                src={user.avatar}
                icon={<UserOutlined style={{ fontSize: 60 }} />}
                style={{ marginBottom: 16 }}
              />
              <Title level={3} style={{ color: '#2C2A28', fontWeight: '600', marginBottom: 4 }}>
                {user.username}
              </Title>
              <Tag style={{ borderRadius: '10px' }}>用户ID: {user.user_id}</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title={<span style={{ color: '#2C2A28', fontWeight: '600' }}>详细资料</span>} style={{ borderRadius: '16px', border: 'none' }} styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ color: '#D97A4A', marginRight: 12, fontSize: 18 }} />
                    <div>
                      <Text type="secondary" style={{ color: '#8C8A87', fontSize: 13 }}>用户名</Text>
                      <br />
                      <Text style={{ color: '#2C2A28', fontSize: 15, fontWeight: '500' }}>{user.username}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneOutlined style={{ color: '#D97A4A', marginRight: 12, fontSize: 18 }} />
                    <div>
                      <Text type="secondary" style={{ color: '#8C8A87', fontSize: 13 }}>手机号</Text>
                      <br />
                      <Text style={{ color: '#2C2A28', fontSize: 15, fontWeight: '500' }}>{user.phone || '-'}</Text>
                    </div>
                  </div>
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0', borderColor: '#FAF9F8' }} />

              <Row gutter={16}>
                <Col xs={24}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ color: '#D97A4A', marginRight: 12, fontSize: 18 }} />
                    <div>
                      <Text type="secondary" style={{ color: '#8C8A87', fontSize: 13 }}>注册时间</Text>
                      <br />
                      <Text style={{ color: '#2C2A28', fontSize: 15, fontWeight: '500' }}>{new Date(user.create_time).toLocaleString()}</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserDetail
