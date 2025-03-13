import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoutes from "../components/PrivateRoutes";
import Cart from "../pages/Cart";
import HomeClient from "../pages/HomeClient";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import Profile from "../pages/Profile";
import SignInGoogle from "../pages/SignInGoogle";
import PaymentsCart from "../pages/PaymentsCart";
import OrderClient from "../pages/OrderClient";
import OrderDetails from "../pages/OrderClient/OrderDetails";
import OrderAdmin from "../pages/OrderAdmin";
import OrderDetailsAdmin from "../pages/OrderAdmin/orderDetails";
import ProductAdmin from "../pages/ProductAdmin";
import AddProduct from "../pages/ProductAdmin/addProduct";
import EditProduct from "../pages/ProductAdmin/editProduct";
import User from "../pages/Users";
import HomeAd from "../pages/Home/homeAdmin";
import PrivateRoutesAdmin from "../components/PrivateRoutes/adminPrivate";
import Payments from "../pages/PaymentsCart/payments";
export const routes = [
    {
        path: '/',
        element: <LayoutDefault />,
        children: [

            {
                path: 'home',
                element: <HomeClient />
            },
            {
                path: '/',
                element: <HomeClient />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'shop',
                element: <Shop />
            },
            {
                path: 'shop/:productId',
                element: <ProductDetails />
            },
            {
                path: 'profile',
                element: <Profile />
            },
            {
                path: 'auth/signingoogle',
                element: <SignInGoogle />
            },
            {
                element: <PrivateRoutesAdmin />,
                children: [
                    {
                        path: 'admin/order-details/:id',
                        element: <OrderDetailsAdmin />
                    },
                    {
                        path: 'admin/products',
                        element: <ProductAdmin />
                    },
                    {
                        path: 'admin/add-product',
                        element: <AddProduct />
                    },
                    {
                        path: 'admin/edit-product/:id',
                        element: <EditProduct />
                    },
                    {
                        path: 'admin/order',
                        element: <OrderAdmin />
                    },
                    
                    {
                        path: 'admin',
                        element: <HomeAd />
                    },
                    {
                        path: 'admin/accounts',
                        element: <User />
                    },

                ]
            },
            {
                element: <PrivateRoutes />,
                children: [
                    {
                        path: 'cart',
                        element: <Cart />
                    },
                    {
                        path: '/',
                        element: <Home />
                    },
                    {
                        path: 'payments-cart',
                        element: <PaymentsCart />
                    },
                    {
                        path: 'order',
                        element: <OrderClient />
                    },
                    {
                        path: 'order/:id',
                        element: <OrderDetails />
                    },{
                        path: 'payments',
                        element: <Payments />
                    },
                ]
            }
        ]
    }
]