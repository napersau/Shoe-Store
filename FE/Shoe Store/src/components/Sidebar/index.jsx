import { Menu } from "antd";
import { ShoppingCartOutlined, UserOutlined, ProductOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

function MenuSider() {
    const items = [
        {
            label: <Link to='admin/products'>Quản lý sản phẩm</Link> ,
            icon: <ProductOutlined />,
            key: "menu-1",
        },
        {
            label: <Link to='admin/order'>Quản lý đơn hàng</Link> ,
            icon: <ShoppingCartOutlined />,
            key: "menu-1",
        }, {
            label: <Link to='admin/accounts'>Quản lý tài khoản</Link> ,
            icon: <UserOutlined />,
            key: "menu-1",
        },
    ]
    return (
        <Menu
            mode="inline"
            items={items}
        />
    )
}
export default MenuSider;