import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = () => {
    axios
      .get(`http://localhost:3019/userorders/${userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  };

  // Status colors
  const statusColors = {
    Pending: "warning",
    Processing: "info",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "error",
  };

  // Handle order cancellation
  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setCancelDialog(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axios.put(`http://localhost:3019/orders/${selectedOrder._id}`, {
        status: "Cancelled"
      });
      
      // Update the local orders state
      setOrders(orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, status: "Cancelled" }
          : order
      ));
      
      setCancelDialog(false);
      setSelectedOrder(null);
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  // Check if order can be cancelled
  const canCancelOrder = (status) => {
    return status === "Pending" || status === "Processing";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No orders found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Order #{order._id.slice(-6)}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={statusColors[order.status] || "default"}
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Items */}
                  {order.items.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "contain",
                          borderRadius: 8,
                          marginRight: 12,
                        }}
                      />

                      {/* Title & Quantity */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} × ${item.price}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  {/* Total */}
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Total: ${order.totalAmount.toFixed(2)}
                  </Typography>

                  {/* Shipping */}
                  <Typography variant="body2" color="text.secondary">
                    <strong>Shipping to:</strong>{" "}
                    {order.shippingAddress.street},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.zipCode},{" "}
                    {order.shippingAddress.country}
                  </Typography>

                  {/* Date */}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "gray" }}
                  >
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                  <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "gray" }}
                   >
                       Last updated: {new Date(order.updatedAt).toLocaleString()}
                  </Typography>

                  {/* Cancel Button */}
                  {canCancelOrder(order.status) && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Cancel Order
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order #{selectedOrder._id.slice(-6)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: ${selectedOrder.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)} color="primary">
            Keep Order
          </Button>
          <Button onClick={confirmCancelOrder} color="error" variant="contained">
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderPage;