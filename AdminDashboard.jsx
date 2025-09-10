import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal, Box, TextField, Button, Typography,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Card, CardContent,
  Divider, Chip, Grid, IconButton, AppBar, Toolbar,
  Avatar, Badge, Container, CssBaseline, Tabs, Tab,
  Alert
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const emptyProduct = {
    title: "", price: "", image: "", description: "", category: "",
    rating: { rate: 0, count: 0 }
  };
  const [newProduct, setNewProduct] = useState(emptyProduct);

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const resp = await axios.get("http://localhost:3019/getpro");
      setProducts(resp.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3019/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const resp = await axios.get("http://localhost:3019/getorders");
      setOrders(resp.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rate" || name === "count") {
      setNewProduct({ ...newProduct, rating: { ...newProduct.rating, [name]: value } });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleOpenAddModal = () => {
    setNewProduct(emptyProduct);
    setOpen(true);
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:3019/pro", newProduct);
      alert("Product added successfully!");
      setOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setNewProduct({ ...product, rating: { ...product.rating } });
    setUpdateOpen(true);
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:3019/getpro/${selectedProduct._id}`, newProduct);
      alert("Product updated successfully!");
      setUpdateOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3019/getpro/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleBlockUnblockUser = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await axios.put(`http://localhost:3019/users/${id}`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3019/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Enhanced order status update handler with validation
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3019/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <CssBaseline />
      

      <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Products" />
        <Tab label="Users" />
        <Tab label="Orders" />
        <Tab label="Settings" />
      </Tabs>

      {tabIndex === 0 && (
        <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ height: '100%', boxShadow: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    Total Products
                                </Typography>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                    <InventoryIcon />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                                {products.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ height: '100%', boxShadow: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    Total Users
                                </Typography>
                                <Avatar sx={{ bgcolor: 'success.light' }}>
                                    <PeopleIcon />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                                {users.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ height: '100%', boxShadow: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    Orders
                                </Typography>
                                <Avatar sx={{ bgcolor: 'warning.light' }}>
                                    <ShoppingCartIcon />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                                {orders.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Cancelled: {orders.filter(o => o.status === "Cancelled").length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ height: '100%', boxShadow: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    Revenue
                                </Typography>
                                <Avatar sx={{ bgcolor: 'error.light' }}>
                                    <InsightsIcon />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                                ${orders
                                    .filter(order => order.status !== "Cancelled")
                                    .reduce((total, order) => total + order.totalAmount, 0)
                                    .toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Excludes cancelled orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

      )}

      {tabIndex === 1 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h5">Products</Typography>
            <Button variant="contained" onClick={handleOpenAddModal} startIcon={<AddIcon />}>Add Product</Button>
          </Box>
          <Grid container spacing={3}>
            {products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card>
                {/* Product Image */}
                  <Box sx={{ height: 200,overflow:'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor:'#f5f5f5' }}>
                    <img src={product.image} alt={product.title} style={{ maxHeight: '100%', maxWidth: '100%' ,objectFit: 'contain'}} />
                  </Box>
                {/* Product Info */}
                  <CardContent>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography color="primary">${product.price}</Typography>
                    <Typography variant="body2">Category: {product.category}</Typography>
                    <Chip 
                        label={`${product.rating?.rate ?? "N/A"} ⭐`} 
                        size="small" 
                        sx={{ mr: 1 }} 
                    />
                    <Typography variant="caption">
                        ({product.rating?.count ?? 0} reviews)
                    </Typography>
                  </CardContent>
                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                    <Button variant='contained' size="small" onClick={() => handleUpdateClick(product)}>Update</Button>
                    <Button variant='contained' size="small" color="error" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h5">Users</Typography>             
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <span 
                            style={{ 
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                backgroundColor: user.status === "active" ? '#e6f7ed' : '#ffeaea',
                                color: user.status === "active" ? '#007d51' : '#d32f2f'
                            }}
                        >
                            {user.status}
                        </span>
                    </TableCell>
                    <TableCell >
                      <Button size="small" onClick={() => handleBlockUnblockUser(user._id, user.status)} >{user.status === 'active' ? 'Block' : 'Unblock'}</Button>
                      <Button size="small" color="error" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      
      {tabIndex === 3 && (
  <Box sx={{ mb: 5 }}>
    <Typography variant="h5" gutterBottom>Orders</Typography>
    
    {/* Order Statistics */}
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6">{orders.filter(o => o.status === "Pending").length}</Typography>
          <Typography variant="body2" color="text.secondary">Pending</Typography>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6">{orders.filter(o => o.status === "Processing").length}</Typography>
          <Typography variant="body2" color="text.secondary">Processing</Typography>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6">{orders.filter(o => o.status === "Shipped").length}</Typography>
          <Typography variant="body2" color="text.secondary">Shipped</Typography>
        </Card>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Card sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6" color="error">{orders.filter(o => o.status === "Cancelled").length}</Typography>
          <Typography variant="body2" color="text.secondary">Cancelled</Typography>
        </Card>
      </Grid>
    </Grid>

    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Shipping Address</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map(order => (
            <TableRow key={order._id} sx={{ 
              backgroundColor: order.status === "Cancelled" ? "#ffebee" : "inherit" 
            }}>
              <TableCell>{order._id.slice(-6)}</TableCell>
              <TableCell>{order.userId?.name} ({order.userId?.email})</TableCell>
              <TableCell>
                <Typography sx={{ 
                  textDecoration: order.status === "Cancelled" ? "line-through" : "none",
                  color: order.status === "Cancelled" ? "text.secondary" : "inherit"
                }}>
                  ${order.totalAmount.toFixed(2)}
                </Typography>
              </TableCell>

              {/* Enhanced Status with dropdown */}
              <TableCell>
                <Chip 
                  label={order.status} 
                  color={
                    order.status === "Pending" ? "warning" :
                    order.status === "Processing" ? "info" :
                    order.status === "Shipped" ? "primary" :
                    order.status === "Delivered" ? "success" :
                    "error"
                  }
                  size="small"
                  sx={{ mr: 1 }}
                />
                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancel</option>
                  </select>
                )}
              </TableCell>

              {/* Shipping Address */}
              <TableCell>
                {order.shippingAddress ? (
                  <Box>
                    <Typography variant="body2">
                      {order.shippingAddress.street},
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.country}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No address provided
                  </Typography>
                )}
              </TableCell>

              {/* Created & Updated timestamps */}
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(order.updatedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}

      {tabIndex === 4 && (
        <Box>
          <Typography variant="h5" gutterBottom>Settings</Typography>
          <Typography color="text.secondary">Settings panel is under development</Typography>
        </Box>
      )}

      {/* Add & Update Product Modals */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add Product</Typography>
          <ProductForm newProduct={newProduct} handleChange={handleChange} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddProduct}>Add</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Update Product</Typography>
          <ProductForm newProduct={newProduct} handleChange={handleChange} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateProduct}>Update</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const ProductForm = ({ newProduct, handleChange }) => (
  <>
    <TextField label="Title" name="title" value={newProduct.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
    <TextField label="Price" name="price" type="number" value={newProduct.price} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
    <TextField label="Category" name="category" value={newProduct.category} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
    <TextField label="Image URL" name="image" value={newProduct.image} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
    <TextField label="Description" name="description" value={newProduct.description} multiline rows={3} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
    <TextField label="Rating Rate" name="rate" value={newProduct.rating.rate} onChange={handleChange} type="number" fullWidth sx={{ mb: 2 }} />
    <TextField label="Rating Count" name="count" value={newProduct.rating.count} onChange={handleChange} type="number" fullWidth sx={{ mb: 2 }} />
  </>
);

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default AdminDashboard;