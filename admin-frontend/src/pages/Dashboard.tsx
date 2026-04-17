import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Typography, Row, Col, Statistic, Spin, Tag, Space } from 'antd'
import { ShoppingOutlined, UserOutlined, ShopOutlined, DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, SendOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { StatsOverview } from '../types'

const { Title } = Typography

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<StatsOverview | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const data = await adminService.getStatsOverview()
      setStats(data)
    } catch (err) {
      console.error('获取统计数据失败', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleStatusClick = (status: string | null) => {
    navigate('/orders', { state: { statusFilter: status } })
  }

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600', marginBottom: 24 }}>
        数据概览
      </Title>

      <Spin spinning={loading}>
        {/* 核心数据统计 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '16px', border: 'none' }}>
              <Statistic
                title={<span style={{ color: '#8C8A87' }}>总订单数</span>}
                value={stats?.total_orders || 0}
                prefix={<ShoppingOutlined style={{ color: '#D97A4A' }} />}
                valueStyle={{ color: '#2C2A28', fontWeight: '600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '16px', border: 'none' }}>
              <Statistic
                title={<span style={{ color: '#8C8A87' }}>商品总数</span>}
                value={stats?.total_goods || 0}
                prefix={<ShopOutlined style={{ color: '#D97A4A' }} />}
                valueStyle={{ color: '#2C2A28', fontWeight: '600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '16px', border: 'none' }}>
              <Statistic
                title={<span style={{ color: '#8C8A87' }}>总销售额</span>}
                value={stats?.total_sales || 0}
                precision={2}
                prefix={<DollarOutlined style={{ color: '#D97A4A' }} />}
                valueStyle={{ color: '#D97A4A', fontWeight: '600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '16px', border: 'none' }}>
              <Statistic
                title={<span style={{ color: '#8C8A87' }}>用户总数</span>}
                value={stats?.total_users || 0}
                prefix={<UserOutlined style={{ color: '#D97A4A' }} />}
                valueStyle={{ color: '#2C2A28', fontWeight: '600' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 订单状态统计 */}
        <Card
          title={<span style={{ color: '#2C2A28', fontWeight: '600' }}>订单状态</span>}
          style={{ borderRadius: '16px', border: 'none' }}
          styles={{ header: { borderBottom: '1px solid #FAF9F8' } }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div
                onClick={() => handleStatusClick('pending_payment')}
                style={{ textAlign: 'center', padding: '16px', background: '#FFF9F5', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                className="prd-address-item"
              >
                <ClockCircleOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: '600', color: '#2C2A28', marginBottom: 4 }}>
                  {stats?.pending_payment_count || 0}
                </div>
                <Tag color="orange" style={{ borderRadius: '10px' }}>待付款</Tag>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div
                onClick={() => handleStatusClick('pending_shipment')}
                style={{ textAlign: 'center', padding: '16px', background: '#F0F7FF', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                className="prd-address-item"
              >
                <SendOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: '600', color: '#2C2A28', marginBottom: 4 }}>
                  {stats?.pending_shipment_count || 0}
                </div>
                <Tag color="blue" style={{ borderRadius: '10px' }}>待发货</Tag>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div
                onClick={() => handleStatusClick('pending_receipt')}
                style={{ textAlign: 'center', padding: '16px', background: '#E6FFFB', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                className="prd-address-item"
              >
                <ShoppingOutlined style={{ fontSize: 32, color: '#13c2c2', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: '600', color: '#2C2A28', marginBottom: 4 }}>
                  {stats?.pending_receipt_count || 0}
                </div>
                <Tag color="cyan" style={{ borderRadius: '10px' }}>待收货</Tag>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div
                onClick={() => handleStatusClick('completed')}
                style={{ textAlign: 'center', padding: '16px', background: '#F6FFED', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                className="prd-address-item"
              >
                <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: '600', color: '#2C2A28', marginBottom: 4 }}>
                  {stats?.completed_count || 0}
                </div>
                <Tag color="green" style={{ borderRadius: '10px' }}>已完成</Tag>
              </div>
            </Col>
          </Row>
        </Card>
      </Spin>
    </div>
  )
}

export default Dashboard
