import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, List, Button, InputNumber, Checkbox, Typography, Space, Spin, message, Empty } from 'antd'
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { fetchCartList, updateCartItem, deleteCartItem } from '@/store/cartSlice'
import { shopService } from '@/services/shopService'

const { Title, Text } = Typography

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading } = useSelector((state: RootState) => state.cart)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    dispatch(fetchCartList())
  }, [dispatch])

  useEffect(() => {
    setSelectedIds(items.filter((item) => item.checked).map((item) => item.cart_id))
  }, [items])

  const handleQuantityChange = async (cartId: number, quantity: number) => {
    try {
      await dispatch(updateCartItem({ cart_id: cartId, quantity })).unwrap()
    } catch (err) {
      message.error('更新数量失败')
    }
  }

  const handleCheckedChange = async (cartId: number, checked: boolean) => {
    try {
      await dispatch(updateCartItem({ cart_id: cartId, checked })).unwrap()
    } catch (err) {
      message.error('更新失败')
    }
  }

  const handleDelete = async (cartId: number) => {
    try {
      await dispatch(deleteCartItem(cartId)).unwrap()
      message.success('删除成功')
    } catch (err) {
      message.error('删除失败')
    }
  }

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要结算的商品')
      return
    }
    try {
      const order = await shopService.checkoutCart({ cart_ids: selectedIds })
      message.success('下单成功')
      navigate(`/orders/${order.order_id}`)
    } catch (err) {
      message.error('结算失败')
    }
  }

  const totalPrice = items
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  return (
    <div>
      <Title level={2}>购物车</Title>
      <Spin spinning={loading}>
        {items.length === 0 ? (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="购物车是空的"
            >
              <Link to="/goods">
                <Button type="primary" icon={<ShoppingOutlined />}>
                  去购物
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <>
            <Card
              style={{ marginBottom: 16 }}
              extra={
                <Space>
                  <Text strong>合计：</Text>
                  <Text type="danger" style={{ fontSize: 20, fontWeight: 'bold' }}>
                    ¥{totalPrice.toFixed(2)}
                  </Text>
                  <Button type="primary" size="large" onClick={handleCheckout}>
                    结算 ({selectedIds.length})
                  </Button>
                </Space>
              }
            >
              <List
                dataSource={items}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <InputNumber
                        key="quantity"
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item.cart_id, value || 1)}
                      />,
                      <Button
                        key="delete"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.cart_id)}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Checkbox
                          checked={item.checked}
                          onChange={(e) => handleCheckedChange(item.cart_id, e.target.checked)}
                        />
                      }
                      title={
                        <Link to={`/goods/${item.goods_id}`}>
                          {item.goods_name || `商品 #${item.goods_id}`}
                        </Link>
                      }
                      description={
                        <Text type="danger" strong>
                          ¥{item.price?.toFixed(2) || '0.00'}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}
      </Spin>
    </div>
  )
}

export default Cart
