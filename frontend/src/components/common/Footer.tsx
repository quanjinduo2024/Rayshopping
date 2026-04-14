import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

const Footer = () => {
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      Rayshopping ©{new Date().getFullYear()} Created by Team
    </AntFooter>
  )
}

export default Footer
