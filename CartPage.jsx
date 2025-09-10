import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, IconButton, List, ListItem, ListItemText, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./CartPage.css";

const CartPage = ({ cart, setCart }) => {
    const navigate = useNavigate();

    // ✅ Remove item from cart
    const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
    };

    // ✅ Calculate total price
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    // ✅ Proceed to checkout with cart items
    const handleCheckout = () => {
        navigate("/checkout", { state: { cartItems: cart } });
        // Clear the cart after navigating to checkout
        setCart([]);
    };

    return (
        <div className="cart-container">
            <Typography variant="h4" gutterBottom>🛒 Shopping Cart</Typography>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <img src="/empty-cart.png" alt="Empty Cart" className="empty-cart-image" />
                    <Typography variant="h6">Your cart is empty.</Typography>
                </div>
            ) : (
                <List>
                    {cart.map((item) => (
                        <ListItem key={item.id} className="cart-item">
                            {/* Product info */}
                            <div className="cart-item-details">
                                {item.image && <img src={item.image} alt={item.title} className="cart-item-image" />}
                                <ListItemText
                                    primary={item.title}
                                    secondary={`$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`}
                                />
                            </div>

                            {/* Quantity controls */}
                                <div className="quantity-controls">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            setCart(cart.map(p =>
                                                p.id === item.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
                                            ))
                                        }
                                        aria-label="decrease quantity"
                                    >
                                        -
                                    </Button>
                                    <Typography variant="body1" className="quantity">{item.quantity}</Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() =>
                                            setCart(cart.map(p =>
                                                p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                                            ))
                                        }
                                        aria-label="increase quantity"
                                    >
                                        +
                                    </Button>
                                </div>
                                <IconButton
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label={`remove ${item.title}`}
                                    color="secondary"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            
                        </ListItem>
                    ))}
                    <Divider />
                    <ListItem>
                        <Typography variant="h6">Total: ${totalPrice}</Typography>
                    </ListItem>
                </List>
            )}

            <div className="cart-buttons">
                <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                    Continue Shopping
                </Button>
                {cart.length > 0 && (
                    <Button variant="contained" color="success" onClick={handleCheckout}>
                        Proceed to Checkout
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CartPage;
