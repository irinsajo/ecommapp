const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Product = require("./Models/product");
const User = require("./Models/user");
const Order = require("./Models/order"); // ✅ Import Order model
require("./connection");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3019;
const JWT_SECRET = "mysecretkey"; // 🔒 Replace with env variable in production

// ✅ Signup API
app.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hash password
        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password); // ✅ Compare hashed
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        if (user.status === "blocked") {
            return res.status(403).json({ message: "Your account has been blocked" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful!", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get All Users (Admin)
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// ✅ Update User Status
app.put("/users/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ message: `User ${status} successfully!`, updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Update failed" });
    }
});

// ✅ Delete User
app.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

// ✅ Product APIs
app.post("/pro", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add product" });
    }
});

app.get("/getpro", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

app.put("/getpro/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Product updated successfully!", updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update product" });
    }
});

app.delete("/getpro/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete product" });
    }
});

// ✅ Save Order API
app.post('/placeorder', async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newOrder = new Order({ 
            userId, 
            items, 
            totalAmount, 
            shippingAddress,
            status: 'Pending' 
        });
        await newOrder.save();

        res.status(201).json({ 
            message: 'Order saved successfully!', 
            orderId: newOrder._id 
        });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Get All Orders API (for Admin)
app.get('/getorders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Order Status (Admin & User Cancellation)
app.put('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        // Find the current order
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Validation for order cancellation
        if (status === "Cancelled") {
            // Only allow cancellation if order is in Pending or Processing status
            if (!["Pending", "Processing"].includes(currentOrder.status)) {
                return res.status(400).json({ 
                    error: "Order cannot be cancelled. It has already been shipped or delivered." 
                });
            }
        }

        // Validation for status transitions (optional - can be customized)
        const allowedTransitions = {
            "Pending": ["Processing", "Cancelled"],
            "Processing": ["Shipped", "Cancelled"], 
            "Shipped": ["Delivered"],
            "Delivered": [], // Cannot change delivered orders
            "Cancelled": [] // Cannot change cancelled orders
        };

        if (currentOrder.status !== status && 
            !allowedTransitions[currentOrder.status].includes(status)) {
            return res.status(400).json({ 
                error: `Cannot change order status from ${currentOrder.status} to ${status}` 
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        );

        res.status(200).json({ 
            message: 'Order status updated successfully!', 
            order: updatedOrder 
        });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Cancel Order API (specific endpoint for user cancellation)
app.put('/orders/:id/cancel', async (req, res) => {
    try {
        const orderId = req.params.id;
        const { userId } = req.body; // Optional: to verify user ownership

        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Optional: Verify user owns this order
        if (userId && currentOrder.userId.toString() !== userId) {
            return res.status(403).json({ error: "Unauthorized to cancel this order" });
        }

        // Check if order can be cancelled
        if (!["Pending", "Processing"].includes(currentOrder.status)) {
            return res.status(400).json({ 
                error: "Order cannot be cancelled. It has already been shipped or delivered." 
            });
        }

        const cancelledOrder = await Order.findByIdAndUpdate(
            orderId, 
            { status: "Cancelled" }, 
            { new: true }
        );

        res.status(200).json({ 
            message: 'Order cancelled successfully!', 
            order: cancelledOrder 
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get User's Order History
app.get('/userorders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
