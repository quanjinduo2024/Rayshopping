import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox, InputNumber, Button, Typography, Spin, message, Empty, Space, Divider } from 'antd'
import { DeleteOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons'
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
    if (quantity < 1) return
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

  const handleCheckAll = async (checked: boolean) => {
    for (const item of items) {
      try {
        await dispatch(updateCartItem({ cart_id: item.cart_id, checked })).unwrap()
      } catch (err) {
        console.error('更新失败', err)
      }
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

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要结算的商品')
      return
    }
    navigate('/checkout')
  }

  const selectedItems = items.filter((item) => item.checked)
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const allChecked = items.length > 0 && items.every((item) => item.checked)

  return (
    <div className="jd-page-content" style={{ padding: '20px 50px' }}>
      <Title level={2} style={{ marginBottom: 20 }}>
        <ShoppingCartOutlined style={{ marginRight: 10 }} />
        购物车
      </Title>

      <Spin spinning={loading}>
        {items.length === 0 ? (
          <div style={{ background: '#fff', padding: '80px 0', textAlign: 'center' }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="购物车是空的"
            >
              <Link to="/goods">
                <Button type="primary" size="large" icon={<ShoppingOutlined />}>
                  去购物
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <>
            {/* 购物车列表 */}
            <div className="jd-cart-header">
              <Space>
                <Checkbox
                  checked={allChecked}
                  onChange={(e) => handleCheckAll(e.target.checked)}
                >
                  全选
                </Checkbox>
                <Divider type="vertical" />
                <Text type="secondary">商品信息</Text>
              </Space>
              <Space style={{ marginLeft: 'auto' }}>
                <Text type="secondary" style={{ width: 100, textAlign: 'center' }}>
                  单价
                </Text>
                <Text type="secondary" style={{ width: 120, textAlign: 'center' }}>
                  数量
                </Text>
                <Text type="secondary" style={{ width: 100, textAlign: 'center' }}>
                  小计
                </Text>
                <Text type="secondary" style={{ width: 80, textAlign: 'center' }}>
                  操作
                </Text>
              </Space>
            </div>

            {items.map((item) => (
              <div key={item.cart_id} className="jd-cart-item">
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Checkbox
                    checked={item.checked}
                    onChange={(e) => handleCheckedChange(item.cart_id, e.target.checked)}
                    style={{ marginRight: 15 }}
                  />

                  <div className="jd-cart-image" style={{ overflow: 'hidden' }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.goods_name || '商品'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <ShoppingOutlined style={{ fontSize: 32, color: '#999' }} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <Link to={`/goods/${item.goods_id}`} className="jd-cart-title">
                      {item.goods_name || `商品 #${item.goods_id}`}
                    </Link>
                  </div>

                  <div style={{ width: 100, textAlign: 'center' }}>
                    <span className="jd-cart-price">¥{item.price?.toFixed(2) || '0.00'}</span>
                  </div>

                  <div style={{ width: 120, textAlign: 'center' }}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.cart_id, value || 1)}
                    />
                  </div>

                  <div style={{ width: 100, textAlign: 'center' }}>
                    <span className="jd-cart-total">
                      ¥{((item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ width: 80, textAlign: 'center' }}>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(item.cart_id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </Spin>

      {/* 底部结算栏 */}
      {items.length > 0 && (
        <div className="jd-cart-footer">
          <div className="jd-cart-footer-left">
            <Checkbox
              checked={allChecked}
              onChange={(e) => handleCheckAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          <div className="jd-cart-footer-right">
            <div className="jd-selected-count">
              已选 <span>{selectedIds.length}</span> 件
            </div>
            <div>
              <span className="jd-total-price-label">合计：</span>
              <span className="jd-total-price">¥{totalPrice.toFixed(2)}</span>
            </div>
            <Button
              type="primary"
              size="large"
              className="jd-btn-checkout"
              onClick={handleCheckout}
              disabled={selectedIds.length === 0}
            >
              去结算
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
