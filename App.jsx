import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProductPage from "./components/ProductPage";
import AuthPage from "./components/AuthPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Checkout from "./components/Checkout";
import CartPage from "./components/CartPage";
import OrderPage from "./components/OrderPage";   // ✅ Import OrderPage
import UserProfile from './components/UserProfile';

function App() {
    const navigate = useNavigate();

    const getInitialLoginState = () => localStorage.getItem("isLoggedIn") === "true";
    const getInitialAdminState = () => localStorage.getItem("isAdmin") === "true";
    const getInitialCartState = () => JSON.parse(localStorage.getItem("cart")) || [];

    const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState);
    const [isAdmin, setIsAdmin] = useState(getInitialAdminState);
    const [cart, setCart] = useState(getInitialCartState);

    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
        localStorage.setItem("isAdmin", isAdmin);
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [isLoggedIn, isAdmin, cart]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("userId");   // ✅ clear userId on logout
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/login");
    };

    return (
        <>
            <Navbar 
                isLoggedIn={isLoggedIn} 
                isAdmin={isAdmin} 
                setIsLoggedIn={setIsLoggedIn} 
                setIsAdmin={setIsAdmin} 
                handleLogout={handleLogout} 
            />
            
            <Routes>
                {/* ✅ Public Routes */}
                <Route path="/" element={<ProductPage isLoggedIn={isLoggedIn} cart={cart} setCart={setCart} />} />
                <Route path="/login" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />

                {/* ✅ Admin Route */}
                <Route 
                    path="/admin-dashboard" 
                    element={isAdmin ? <AdminDashboard /> : <AdminLogin setIsAdmin={setIsAdmin} />} 
                />

                {/* ✅ Checkout (User Only) */}
                <Route 
                    path="/checkout" 
                    element={isLoggedIn ? <Checkout cart={cart} /> : <AuthPage setIsLoggedIn={setIsLoggedIn} />} 
                />

                {/* ✅ Orders (User Only) */}
                <Route 
                    path="/orders" 
                    element={isLoggedIn ? <OrderPage /> : <AuthPage setIsLoggedIn={setIsLoggedIn} />} 
                />

                {/* ✅ Cart */}
                <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />

                <Route path="/profile" element={<UserProfile />} />

            </Routes>
        </>
    );
}

export default App;
