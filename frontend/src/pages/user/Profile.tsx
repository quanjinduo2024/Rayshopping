import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Menu, Typography, Breadcrumb } from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  SettingOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import type { AppDispatch, RootState } from '@/store'
import { fetchUserInfo } from '@/store/userSlice'
import { Link, useLocation } from 'react-router-dom'
import ProfileHome from './ProfileHome'
import ProfileOrders from './ProfileOrders'
import ProfileFavorites from './ProfileFavorites'
import ProfileAddress from './ProfileAddress'
import ProfileSecurity from './ProfileSecurity'
import ProfileSettings from './ProfileSettings'

const { Content, Sider } = Layout
const { Title } = Typography

type MenuKey = 'home' | 'orders' | 'favorites' | 'address' | 'security' | 'settings'

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.user)

  // 从 URL query 参数获取当前选中的菜单项，默认为 'home'
  const getSelectedKey = (): MenuKey => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab') as MenuKey
    return tab && ['home', 'orders', 'favorites', 'address', 'security', 'settings'].includes(tab)
      ? tab
      : 'home'
  }

  const [selectedKey, setSelectedKey] = useState<MenuKey>(getSelectedKey())

  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  useEffect(() => {
    setSelectedKey(getSelectedKey())
  }, [location.search])

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '个人主页',
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: '我的订单',
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: '我的收藏',
    },
    {
      key: 'address',
      icon: <EnvironmentOutlined />,
      label: '收货地址',
    },
    {
      key: 'security',
      icon: <SafetyOutlined />,
      label: '账户安全',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key as MenuKey)
  }

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <ProfileHome />
      case 'orders':
        return <ProfileOrders />
      case 'favorites':
        return <ProfileFavorites />
      case 'address':
        return <ProfileAddress />
      case 'security':
        return <ProfileSecurity />
      case 'settings':
        return <ProfileSettings />
      default:
        return <ProfileHome />
    }
  }

  const getBreadcrumbItems = () => {
    const items = [
      { title: <Link to="/">首页</Link> },
      { title: '会员中心' },
    ]
    const currentItem = menuItems.find(item => item.key === selectedKey)
    if (currentItem) {
      items.push({ title: currentItem.label })
    }
    return items
  }

  return (
    <div className="prd-page-content" style={{ background: 'transparent', minHeight: 'calc(100vh - 210px)', padding: '24px 50px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbItems()} style={{ marginBottom: '24px' }} />

        <Layout style={{ background: 'transparent', minHeight: '600px' }}>
          {/* 左侧导航 */}
          <Sider
            width={220}
            style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '24px', borderBottom: '1px solid #FAF9F8', background: '#FAF9F8' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ fontSize: '28px', color: '#D97A4A', marginRight: '12px' }} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#2C2A28' }}>
                    {user?.username || '用户'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8C8A87', marginTop: '4px' }}>
                    普通会员
                  </div>
                </div>
              </div>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ border: 'none' }}
            />
          </Sider>

          {/* 右侧内容 */}
          <Content
            style={{
              background: '#fff',
              marginLeft: '20px',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </div>
    </div>
  )
}

export default Profile
