import { 
  AppBar, Box, IconButton, Toolbar, Typography, Badge, Tooltip 
} from '@mui/material';
import React from 'react';
import { 
  ShoppingCart, Person, Home, Assignment, Login, Logout, AdminPanelSettings 
} from '@mui/icons-material'; 
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, isAdmin, setIsLoggedIn, setIsAdmin, cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="header">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            GoBuy
          </Typography>

          <div className="nav-buttons" style={{ display: 'flex', gap: '10px' }}>
            {isLoggedIn && (
              <>
                {/* Home */}
                <Tooltip title="Home">
                  <IconButton color="inherit" onClick={() => navigate('/')}>
                    <Home />
                  </IconButton>
                </Tooltip>

                {/* Cart */}
                <Tooltip title="Cart">
                  <IconButton color="inherit" onClick={() => navigate('/cart')}>
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* Orders */}
                <Tooltip title="Orders">
                  <IconButton color="inherit" onClick={() => navigate('/orders')}>
                    <Assignment />
                  </IconButton>
                </Tooltip>

                {/* Profile */}
                <Tooltip title="Profile">
                  <IconButton color="inherit" onClick={() => navigate('/profile')}>
                    <Person />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {(isAdmin || isLoggedIn) ? (
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={handleLogout}>
                  <Logout />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Login">
                  <IconButton color="inherit" component={Link} to="/login">
                    <Login />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Admin Login">
                  <IconButton color="inherit" component={Link} to="/admin-login">
                    <AdminPanelSettings />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
