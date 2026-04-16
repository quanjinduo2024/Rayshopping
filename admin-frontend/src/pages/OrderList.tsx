import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Typography, Tag, Space, Button, Select, Card, Spin, message, Avatar } from 'antd'
import { ShoppingOutlined, EyeOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { Order } from '../types'

const { Title } = Typography
const { Option } = Select

type OrderStatus = 'pending_payment' | 'pending_shipment' | 'pending_receipt' | 'completed' | 'cancelled' | 'refunded'

const OrderList = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [shipLoading, setShipLoading] = useState<number | null>(null)

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'orange'
      case 'pending_shipment':
        return 'blue'
      case 'pending_receipt':
        return 'cyan'
      case 'completed':
        return 'green'
      case 'cancelled':
      case 'refunded':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return '待付款'
      case 'pending_shipment':
        return '待发货'
      case 'pending_receipt':
        return '待收货'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      case 'refunded':
        return '已退款'
      default:
        return status
    }
  }

  const canShip = (status: OrderStatus) => status === 'pending_shipment'

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await adminService.getOrderList(statusFilter)
      const ordersWithNumericPrice = response.items.map((order) => ({
        ...order,
        total_price: Number(order.total_price),
      }))
      setOrders(ordersWithNumericPrice)
    } catch (err) {
      message.error('获取订单列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const handleShip = async (orderId: number) => {
    setShipLoading(orderId)
    try {
      await adminService.shipOrder(orderId)
      message.success('发货成功')
      fetchOrders()
    } catch (err) {
      message.error('发货失败')
    } finally {
      setShipLoading(null)
    }
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 120,
    },
    {
      title: '用户',
      key: 'user',
      width: 180,
      render: (_: any, record: Order) => (
        <Space>
          <Avatar
            size="small"
            src={record.user_info?.avatar}
            icon={<UserOutlined />}
          />
          <span>
            {record.user_info?.username || `用户 #${record.user_id}`}
          </span>
        </Space>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 120,
      render: (price: number) => <span style={{ color: '#e4393c', fontWeight: 'bold' }}>¥{price.toFixed(2)}</span>,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '下单时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: Order) => (
        <Space>
          <Link to={`/orders/${record.order_id}`}>
            <Button size="small" icon={<EyeOutlined />}>
              查看
            </Button>
          </Link>
          {canShip(record.status as OrderStatus) && (
            <Button
              size="small"
              type="primary"
              icon={<SendOutlined />}
              loading={shipLoading === record.order_id}
              onClick={() => handleShip(record.order_id)}
            >
              发货
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          订单管理
        </Title>
        <Select
          placeholder="筛选订单状态"
          style={{ width: 200 }}
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <Option value="pending_payment">待付款</Option>
          <Option value="pending_shipment">待发货</Option>
          <Option value="pending_receipt">待收货</Option>
          <Option value="completed">已完成</Option>
          <Option value="cancelled">已取消</Option>
        </Select>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="order_id"
            pagination={{ pageSize: 20 }}
          />
        </Spin>
      </Card>
    </div>
  )
}

export default OrderList
