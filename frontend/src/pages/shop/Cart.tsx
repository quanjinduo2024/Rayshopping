import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox, InputNumber, Button, Typography, Spin, message, Empty, Space, Divider, Card } from 'antd'
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
    <div className="prd-page-content" style={{ padding: '28px 50px' }}>
      <Title
        level={2}
        style={{
          marginBottom: '24px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#2C2A28',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <ShoppingCartOutlined style={{ color: '#D97A4A' }} />
        购物车
      </Title>

      <Spin spinning={loading}>
        {items.length === 0 ? (
          <Card
            style={{
              background: '#fff',
              padding: '80px 0',
              textAlign: 'center',
              borderRadius: '16px',
              border: 'none',
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span style={{ color: '#8C8A87' }}>购物车是空的</span>}
            >
              <Link to="/goods">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingOutlined />}
                  style={{
                    background: '#D97A4A',
                    borderColor: '#D97A4A',
                    borderRadius: '24px',
                    height: '44px',
                    padding: '0 32px',
                  }}
                >
                  去购物
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <>
            {/* 购物车列表 - PRD风格 */}
            <Card
              style={{ borderRadius: '16px', border: 'none', marginBottom: '24px' }}
              styles={{ body: { padding: '0' } }}
            >
              {/* 表头 */}
              <div
                className="prd-cart-header"
                style={{
                  background: '#FAF9F8',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '16px 16px 0 0',
                }}
              >
                <Space>
                  <Checkbox
                    checked={allChecked}
                    onChange={(e) => handleCheckAll(e.target.checked)}
                  >
                    <span style={{ color: '#5E5B57', fontSize: '14px' }}>全选</span>
                  </Checkbox>
                  <Divider type="vertical" style={{ background: '#E8E6E3' }} />
                  <Text type="secondary" style={{ color: '#8C8A87', fontSize: '14px' }}>
                    商品信息
                  </Text>
                </Space>
                <Space style={{ marginLeft: 'auto' }} size="large">
                  <Text
                    type="secondary"
                    style={{ width: 100, textAlign: 'center', color: '#8C8A87', fontSize: '14px' }}
                  >
                    单价
                  </Text>
                  <Text
                    type="secondary"
                    style={{ width: 140, textAlign: 'center', color: '#8C8A87', fontSize: '14px' }}
                  >
                    数量
                  </Text>
                  <Text
                    type="secondary"
                    style={{ width: 120, textAlign: 'center', color: '#8C8A87', fontSize: '14px' }}
                  >
                    小计
                  </Text>
                  <Text
                    type="secondary"
                    style={{ width: 80, textAlign: 'center', color: '#8C8A87', fontSize: '14px' }}
                  >
                    操作
                  </Text>
                </Space>
              </div>

              {/* 商品列表 */}
              {items.map((item, index) => (
                <div
                  key={item.cart_id}
                  className="prd-cart-item"
                  style={{
                    background: '#fff',
                    padding: '20px 24px',
                    borderTop: index === 0 ? 'none' : '1px solid #FAF9F8',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Checkbox
                      checked={item.checked}
                      onChange={(e) => handleCheckedChange(item.cart_id, e.target.checked)}
                      style={{ marginRight: '20px' }}
                    />

                    {/* 商品图片 - 减小尺寸 */}
                    <div
                      className="prd-cart-image"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: '#FAF9F8',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0,
                        marginRight: '16px',
                      }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.goods_name || '商品'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            background: '#FAF9F8',
                          }}
                        />
                      ) : (
                        <ShoppingOutlined style={{ fontSize: '28px', color: '#C8C6C3' }} />
                      )}
                    </div>

                    {/* 商品标题 - 优化排版 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        to={`/goods/${item.goods_id}`}
                        className="prd-cart-title"
                        style={{
                          color: '#2C2A28',
                          fontSize: '15px',
                          fontWeight: '500',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.goods_name || `商品 #${item.goods_id}`}
                      </Link>
                    </div>

                    {/* 单价 */}
                    <div style={{ width: 100, textAlign: 'center', flexShrink: 0 }}>
                      <span
                        className="prd-cart-price"
                        style={{ color: '#5E5B57', fontSize: '15px', fontWeight: '500' }}
                      >
                        ¥{item.price?.toFixed(2) || '0.00'}
                      </span>
                    </div>

                    {/* 数量 */}
                    <div style={{ width: 140, textAlign: 'center', flexShrink: 0 }}>
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(item.cart_id, value || 1)}
                        style={{ borderRadius: '10px' }}
                      />
                    </div>

                    {/* 小计 */}
                    <div style={{ width: 120, textAlign: 'center', flexShrink: 0 }}>
                      <span
                        className="prd-cart-total"
                        style={{
                          color: '#D97A4A',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        ¥{((item.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* 操作 */}
                    <div style={{ width: 80, textAlign: 'center', flexShrink: 0 }}>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.cart_id)}
                        style={{ color: '#A8A6A3' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </>
        )}
      </Spin>

      {/* 底部结算栏 - PRD风格 */}
      {items.length > 0 && (
        <div
          className="prd-cart-footer"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '72px',
            background: '#fff',
            borderTop: '1px solid #EFEDEA',
            display: 'flex',
            alignItems: 'center',
            padding: '0 50px',
            zIndex: 100,
          }}
        >
          <div className="prd-cart-footer-left">
            <Checkbox
              checked={allChecked}
              onChange={(e) => handleCheckAll(e.target.checked)}
            >
              <span style={{ color: '#5E5B57', fontSize: '14px' }}>全选</span>
            </Checkbox>
          </div>
          <div className="prd-cart-footer-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="prd-selected-count" style={{ color: '#5E5B57', fontSize: '14px' }}>
              已选 <span style={{ color: '#D97A4A', fontWeight: '600' }}>{selectedIds.length}</span> 件
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span className="prd-total-price-label" style={{ color: '#5E5B57', fontSize: '14px' }}>
                合计：
              </span>
              <span
                className="prd-total-price"
                style={{
                  color: '#D97A4A',
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                ¥{totalPrice.toFixed(2)}
              </span>
            </div>
            <Button
              type="primary"
              size="large"
              className="prd-btn-checkout"
              onClick={handleCheckout}
              disabled={selectedIds.length === 0}
              style={{
                background: selectedIds.length === 0 ? '#E8E6E3' : '#D97A4A',
                borderColor: selectedIds.length === 0 ? '#E8E6E3' : '#D97A4A',
                borderRadius: '24px',
                height: '44px',
                padding: '0 40px',
                fontWeight: '500',
              }}
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
