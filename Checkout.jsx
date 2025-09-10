import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";
import axios from "axios";
const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // ✅ Retrieve cart data from navigation state
    const cartItems = location.state?.cartItems || [];

    const [userDetails, setUserDetails] = useState({
        fullName: "",
        address: "",
        city: "",
        zip: "",
        paymentMethod: "Credit Card",
    });

    // ✅ Handle form input changes
    const handleInputChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

// inside Checkout.jsx
const handleOrder = async () => {
  if (!userDetails.fullName || !userDetails.address || !userDetails.city || !userDetails.zip) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in properly. Please login again.");
      return;
    }

    const formattedItems = cartItems.map(item => ({
      productId: item._id || item.id,   // send product reference
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    const shippingAddress = {
      street: userDetails.address,
      city: userDetails.city,
      state: userDetails.state || "",
      zipCode: userDetails.zip,
      country: userDetails.country || "India"
    };

    const res = await axios.post("http://localhost:3019/placeorder", {
      userId,
      items: formattedItems,
      totalAmount,
      shippingAddress
    });

    alert("Order placed successfully!");
    navigate("/orders");
  } catch (err) {
    console.error("Order error:", err.response?.data || err.message);
    alert("Failed to place order.");
  }
};

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="checkout-container" key="checkout-form">  {/* ✅ Add unique key */}
            <h2>Checkout</h2>

            {/* ✅ Order Summary Section */}
            <div className="order-summary" key="order-summary">
                <h3>Order Summary</h3>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item.id} className="order-item">
                            <span>{item.title}</span>
                            <span>${item.price.toFixed(2)} x {item.quantity}</span>
                        </div>
                    ))
                ) : (
                    <p>No items in checkout</p>
                )}
                <div className="total">
                    <strong>Total: </strong> ${totalAmount.toFixed(2)}
                </div>
            </div>

            {/* ✅ User Details Form */}
            <div className="checkout-form" key="user-form">
                <h3>Shipping Details</h3>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={userDetails.fullName}
                    onChange={handleInputChange}
                    key="fullName"  // ✅ Add unique key
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={userDetails.address}
                    onChange={handleInputChange}
                    key="address"  // ✅ Add unique key
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={userDetails.city}
                    onChange={handleInputChange}
                    key="city"  // ✅ Add unique key
                />
                <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    value={userDetails.zip}
                    onChange={handleInputChange}
                    key="zip"  // ✅ Add unique key
                />

                <h3>Payment Method</h3>
                <select
                    name="paymentMethod"
                    value={userDetails.paymentMethod}
                    onChange={handleInputChange}
                    key="payment-method"  // ✅ Add unique key
                >
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                </select>

                <button className="confirm-order" onClick={handleOrder} key="confirm-button">
                    Confirm Order
                </button>
            </div>

            
        </div>
    );
};

export default Checkout;
