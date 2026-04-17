import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Typography, Tag, Space, Button, Empty, Spin, message, Row, Col } from 'antd'
import { UndoOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons'
import { shopService } from '@/services/shopService'
import type { OrderReturn } from '@/types/order'

const { Title, Text } = Typography

type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed'

const ProfileReturns = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [returns, setReturns] = useState<OrderReturn[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })

  const fetchReturns = async (page = 1) => {
    setLoading(true)
    try {
      const response = await shopService.getReturnList(page, 20)
      setReturns(response.items || [])
      setPagination((prev) => ({ ...prev, current: page, total: response.total || 0 }))
    } catch (err) {
      message.error('获取退换货列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReturns(1)
  }, [])

  const getStatusColor = (status: ReturnStatus) => {
    switch (status) {
      case 'pending':
        return 'orange'
      case 'approved':
        return 'blue'
      case 'completed':
        return 'green'
      case 'rejected':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: ReturnStatus) => {
    switch (status) {
      case 'pending':
        return '待审核'
      case 'approved':
        return '已批准'
      case 'completed':
        return '已完成'
      case 'rejected':
        return '已拒绝'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    return type === 'return' ? '退货' : '换货'
  }

  const handleBack = () => {
    navigate('/profile?tab=orders')
  }

  return (
    <div>
      <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ borderRadius: 20, marginRight: 16 }}
          >
            返回订单
          </Button>
          <Title level={3} style={{ color: '#2C2A28', margin: 0 }}>
            <UndoOutlined style={{ marginRight: 8, color: '#D97A4A' }} />
            我的退换货
          </Title>
        </div>

        <Spin spinning={loading}>
          {returns.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text type="secondary" style={{ color: '#8C8A87' }}>暂无退换货申请</Text>
                  <br />
                  <Button type="primary" style={{ marginTop: 16, borderRadius: 20 }} onClick={() => navigate('/goods')}>
                    去购物
                  </Button>
                </div>
              }
            />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {returns.map((item) => (
                <div key={item.return_id} className="prd-order-card">
                  <div className="prd-order-header">
                    <div className="prd-order-info">
                      <span className="prd-order-id">申请号：{item.return_id}</span>
                      <span className="prd-order-time">
                        订单号：{item.order_id}
                      </span>
                    </div>
                    <Space>
                      <Tag color={item.type === 'return' ? 'blue' : 'orange'} style={{ borderRadius: 12 }}>
                        {getTypeText(item.type)}
                      </Tag>
                      <Tag color={getStatusColor(item.status as ReturnStatus)} style={{ borderRadius: 12 }}>
                        {getStatusText(item.status as ReturnStatus)}
                      </Tag>
                    </Space>
                  </div>

                  <div className="prd-order-body">
                    <div style={{ marginBottom: 12 }}>
                      <Text type="secondary" style={{ color: '#8C8A87' }}>申请原因：</Text>
                      <Text style={{ color: '#2C2A28' }}>{item.reason}</Text>
                    </div>
                    {item.remark && (
                      <div style={{ marginBottom: 12 }}>
                        <Text type="secondary" style={{ color: '#8C8A87' }}>备注：</Text>
                        <Text style={{ color: '#5E5B57' }}>{item.remark}</Text>
                      </div>
                    )}
                    {item.approve_remark && (
                      <div style={{ marginBottom: 12 }}>
                        <Text type="secondary" style={{ color: '#8C8A87' }}>审核备注：</Text>
                        <Text style={{ color: '#5E5B57' }}>{item.approve_remark}</Text>
                      </div>
                    )}
                    <div>
                      <Text type="secondary" style={{ color: '#8C8A87' }}>申请时间：</Text>
                      <Text style={{ color: '#5E5B57' }}>{new Date(item.create_time).toLocaleString()}</Text>
                    </div>
                  </div>

                  <div className="prd-order-footer">
                    <div></div>
                    <div className="prd-order-actions">
                      <Link to={`/orders/${item.order_id}`}>
                        <Button size="small" style={{ borderRadius: 16 }}>
                          查看订单
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default ProfileReturns
