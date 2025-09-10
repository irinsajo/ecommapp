import React, { useState, useEffect } from "react";
import {
  Box, Typography, Card, CardContent, Button, Tabs, Tab,
  Grid, Divider, Avatar, IconButton, List, ListItem,
  ListItemText, ListItemSecondaryAction, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { Edit, LocationOn, History, Security } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";   // ✅ added for navigation
import axios from "axios";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);
  const [editMode, setEditMode] = useState("profile");
  const [editedData, setEditedData] = useState({});
  const [newAddress, setNewAddress] = useState({
    title: "", street: "", city: "", state: "",
    zipCode: "", country: "India", isDefault: false
  });

  const navigate = useNavigate();

  // ✅ Fetch user, addresses, orders
  const fetchProfileData = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios.get(`http://localhost:3019/users/${userId}`).then(r => {
      setUserData(r.data);
      setEditedData(r.data);
    });
    axios.get(`http://localhost:3019/users/${userId}/addresses`).then(r => setAddresses(r.data));
    axios.get(`http://localhost:3019/userorders/${userId}`).then(r => setOrders(r.data));
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // ✅ Save Profile Changes
const handleSaveProfile = () => {
  const userId = localStorage.getItem("userId");
  axios.put(`http://localhost:3019/users/${userId}`, editedData).then(() => {
    setUserData(editedData);   // update state directly
    setEditDialog(false);
  });
};

// ✅ Save Address Changes
const handleSaveAddress = () => {
  const userId = localStorage.getItem("userId");

  if (editMode === "address") {
    // Add new address
    axios.post(`http://localhost:3019/users/${userId}/addresses`, newAddress).then((res) => {
      setAddresses([...addresses, res.data]);  // append new address to state
      setAddressDialog(false);
      setNewAddress({ title: "", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false });
    });
  } else {
    // Update existing address
    axios.put(`http://localhost:3019/users/${userId}/addresses/${newAddress._id}`, newAddress).then(() => {
      setAddresses(addresses.map(a => a._id === newAddress._id ? newAddress : a)); // replace updated one
      setAddressDialog(false);
      setNewAddress({ title: "", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false });
    });
  }
}

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} src={userData.avatar}>
                {userData.name?.charAt(0) || "U"}
              </Avatar>
              <Typography variant="h6">{userData.name}</Typography>
              <Typography color="textSecondary">{userData.email}</Typography>
              <Typography color="textSecondary">{userData.phone}</Typography>
              <Button startIcon={<Edit />} onClick={() => setEditDialog(true)} sx={{ mt: 2 }}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn color="primary" /><Typography variant="h6" sx={{ ml: 1 }}>Addresses</Typography>
              </Box>
              <List>
                {addresses.map(addr => (
                  <ListItem key={addr._id} divider>
                    <ListItemText
                      primary={`${addr.title} ${addr.isDefault ? "(Default)" : ""}`}
                      secondary={`${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}, ${addr.country}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => { setEditMode("editAddress"); setNewAddress(addr); setAddressDialog(true); }}><Edit /></IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" fullWidth sx={{ mt: 1 }}
                onClick={() => { setEditMode("address"); setAddressDialog(true); }}>
                Add New Address
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                <Tab icon={<History />} label="Orders" />
                <Tab icon={<Security />} label="Security" />
              </Tabs>
              <Divider sx={{ my: 2 }} />

              {/* Orders Tab */}
              {activeTab === 0 && (
                <>
                  <List>
                    {orders.length ? orders.map(o => (
                      <ListItem key={o._id} divider>
                        <ListItemText
                          primary={`Order #${o._id.slice(-6)}`}
                          secondary={`Placed on: ${new Date(o.createdAt).toLocaleDateString()} | Status: ${o.status} | Total: $${o.totalAmount}`}
                        />
                      </ListItem>
                    )) : <Typography>No orders yet.</Typography>}
                  </List>

                  {/* 🔹 View All Orders Button */}
                  {orders.length > 0 && (
                    <Box sx={{ mt: 2, textAlign: "right" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate("/orders")}
                      >
                        View All Orders
                      </Button>
                    </Box>
                  )}
                </>
              )}

              {/* Security Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6">Security Settings</Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>Change Password</Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {["name", "email", "phone"].map(f => (
            <TextField key={f} margin="dense" label={f.toUpperCase()} fullWidth
              value={editedData[f] || ""} onChange={e => setEditedData({ ...editedData, [f]: e.target.value })} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={addressDialog} onClose={() => setAddressDialog(false)}>
        <DialogTitle>{editMode === "address" ? "Add Address" : "Edit Address"}</DialogTitle>
        <DialogContent>
          {["title", "street", "city", "state", "zipCode", "country"].map(f => (
            <TextField key={f} margin="dense" label={f.toUpperCase()} fullWidth
              value={newAddress[f]} onChange={e => setNewAddress({ ...newAddress, [f]: e.target.value })} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAddress}>{editMode === "address" ? "Add" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
