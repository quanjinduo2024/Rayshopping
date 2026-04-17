import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Typography, Card, Spin, message, Tag, Space, Button, Select, Modal, Input } from 'antd'
import { UndoOutlined, EyeOutlined, CheckOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { OrderReturn } from '../types'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed'

const ReturnList = () => {
  const navigate = useNavigate()
  const [returns, setReturns] = useState<OrderReturn[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })
  const [statusFilter, setStatusFilter] = useState<string>()
  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<OrderReturn | null>(null)
  const [approveRemark, setApproveRemark] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReturns = async (page = 1) => {
    setLoading(true)
    try {
      const response = await adminService.getReturnList(statusFilter, undefined, page, 20)
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
  }, [statusFilter])

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

  const handleApprove = async (approve: boolean) => {
    if (!selectedReturn) return
    setActionLoading(true)
    try {
      await adminService.approveReturn(selectedReturn.return_id, approve, approveRemark)
      message.success(approve ? '批准成功' : '拒绝成功')
      setApproveModalVisible(false)
      setSelectedReturn(null)
      setApproveRemark('')
      fetchReturns(pagination.current)
    } catch (err) {
      message.error('操作失败')
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async (record: OrderReturn) => {
    setActionLoading(true)
    try {
      await adminService.completeReturn(record.return_id)
      message.success('完成成功')
      fetchReturns(pagination.current)
    } catch (err) {
      message.error('操作失败')
    } finally {
      setActionLoading(false)
    }
  }

  const openApproveModal = (record: OrderReturn) => {
    setSelectedReturn(record)
    setApproveRemark('')
    setApproveModalVisible(true)
  }

  const columns = [
    {
      title: '申请ID',
      dataIndex: 'return_id',
      key: 'return_id',
      width: 100,
    },
    {
      title: '订单ID',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 100,
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'return' ? 'blue' : 'orange'}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: ReturnStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: '申请时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: OrderReturn) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                size="small"
                icon={<CheckOutlined />}
                onClick={() => openApproveModal(record)}
                type="primary"
              >
                审核
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleComplete(record)}
              type="primary"
              loading={actionLoading}
            >
              完成
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ borderRadius: '12px' }}
          >
            返回首页
          </Button>
          <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600' }}>
            <UndoOutlined style={{ marginRight: 8, color: '#D97A4A' }} />
            退换货管理
          </Title>
        </Space>
        <Space>
          <Select
            placeholder="状态筛选"
            style={{ width: 150, borderRadius: '12px' }}
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="pending">待审核</Option>
            <Option value="approved">已批准</Option>
            <Option value="rejected">已拒绝</Option>
            <Option value="completed">已完成</Option>
          </Select>
        </Space>
      </div>

      <Card style={{ borderRadius: '16px', border: 'none' }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={returns}
            rowKey="return_id"
            scroll={{ x: 1200 }}
            pagination={{
              ...pagination,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条申请`,
              onChange: (page) => fetchReturns(page),
            }}
          />
        </Spin>
      </Card>

      <Modal
        title="审核退换货申请"
        open={approveModalVisible}
        onCancel={() => setApproveModalVisible(false)}
        footer={null}
      >
        {selectedReturn && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>申请类型：</Typography.Text>
              <Tag color={selectedReturn.type === 'return' ? 'blue' : 'orange'}>
                {getTypeText(selectedReturn.type)}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>申请原因：</Typography.Text>
              <div style={{ marginTop: 8, padding: 12, background: '#FAF9F8', borderRadius: '12px' }}>
                {selectedReturn.reason}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>审核备注：</Typography.Text>
              <TextArea
                rows={4}
                placeholder="请输入审核备注（可选）"
                value={approveRemark}
                onChange={(e) => setApproveRemark(e.target.value)}
                style={{ marginTop: 8, borderRadius: '12px' }}
              />
            </div>
            <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                icon={<CloseOutlined />}
                onClick={() => setApproveModalVisible(false)}
                style={{ borderRadius: '12px' }}
              >
                取消
              </Button>
              <Button
                icon={<CloseOutlined />}
                danger
                onClick={() => handleApprove(false)}
                loading={actionLoading}
                style={{ borderRadius: '12px' }}
              >
                拒绝
              </Button>
              <Button
                icon={<CheckOutlined />}
                type="primary"
                onClick={() => handleApprove(true)}
                loading={actionLoading}
                style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '12px' }}
              >
                批准
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ReturnList
