import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Home from "../components/Home";
import HomeClient from "../components/HomeClient";
import Register from "../components/Register";
import Users from "../components/Users";
import Profile from "../components/Profile";
import ProductAdmin from "../components/ProductAdmin";
import OrderAdmin from "../components/OrderAdmin";
import AddProduct from "../components/AddProduct";
import EditProduct from "../components/EditProduct";
import Shop from "../components/Shop";
import ProductDetail from "../components/ProductDetails"; // Import trang chi tiết sản phẩm
import Cart from "../components/Cart";
import OrderClient from "../components/OrderClient";
import Payments from "../components/Payments";
import PaymentsCart from "../components/PaymentsCart";
import OrderDetails from "../components/OrderDetails";
import OrderDetailsAdmin from "../components/OrderDetailsAdmin";
import SignInGoogle from "../components/SignInGoogle";


// import { getToken } from "../services/localStorageService";

const AppRoutes = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accounts" element={<Users />} />
        <Route path="/admin" element={<Home />} />
        <Route path="/home" element={<HomeClient />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/products" element={<ProductAdmin />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin/order" element={<OrderAdmin />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productId" element={<ProductDetail />} /> {/* Route động */}
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/order" element={<OrderClient />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payments-cart" element={<PaymentsCart />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/admin/order/:id" element={<OrderDetailsAdmin />} />
        <Route path="/auth/signingoogle" element={<SignInGoogle />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
