import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Typography, Button, Card, Spin, message, Input, Space, Popconfirm, Tag } from 'antd'
import { ShopOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { adminService } from '../services/api'
import type { Goods } from '../types'

const { Title } = Typography

const GoodsList = () => {
  const navigate = useNavigate()
  const [goods, setGoods] = useState<Goods[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 })

  const fetchGoods = async (page = 1) => {
    setLoading(true)
    try {
      const response = await adminService.getGoodsList(page, 20, searchText || undefined)
      const goodsWithNumericPrice = response.items.map((item) => ({
        ...item,
        price: Number(item.price),
      }))
      setGoods(goodsWithNumericPrice)
      setPagination((prev) => ({ ...prev, current: page, total: response.total }))
    } catch (err) {
      message.error('获取商品列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoods(1)
  }, [searchText])

  const handleDelete = async (goodsId: number) => {
    try {
      await adminService.deleteGoods(goodsId)
      message.success('删除成功')
      fetchGoods(pagination.current)
    } catch (err) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '商品ID',
      dataIndex: 'goods_id',
      key: 'goods_id',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => <span style={{ color: '#D97A4A', fontWeight: 'bold' }}>¥{price.toFixed(2)}</span>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => category ? <Tag style={{ borderRadius: '10px' }}>{category}</Tag> : '-',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_: any, record: Goods) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            style={{ borderRadius: '12px' }}
            onClick={() => navigate(`/goods/${record.goods_id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个商品吗？"
            onConfirm={() => handleDelete(record.goods_id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: '12px' }}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '20px 24px', background: '#FAF9F8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0, color: '#2C2A28', fontWeight: '600' }}>
          <ShopOutlined style={{ marginRight: 8, color: '#D97A4A' }} />
          商品管理
        </Title>
        <Space>
          <Input
            placeholder="搜索商品名称"
            prefix={<SearchOutlined />}
            style={{ width: 240, borderRadius: '12px' }}
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: '#D97A4A', borderColor: '#D97A4A', borderRadius: '24px' }}
            onClick={() => navigate('/goods/new')}
          >
            添加商品
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: '16px', border: 'none' }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={goods}
            rowKey="goods_id"
            pagination={{
              ...pagination,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 件商品`,
              onChange: (page) => fetchGoods(page),
            }}
          />
        </Spin>
      </Card>
    </div>
  )
}

export default GoodsList
