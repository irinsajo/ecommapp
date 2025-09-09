import { Typography, Button, Chip, Card, CardContent, CardMedia, Box, Rating } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css';

const ProductPage = ({ isLoggedIn, cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3019/getpro")
      .then((resp) => {
        const productsWithId = resp.data.map((p, index) => ({
          ...p,
          id: p.id || index + 1,
        }));
        setProducts(productsWithId);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // ✅ Add to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    alert(`${product.title} added to cart!`);
  };

  // ✅ Buy Now
  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { cartItems: [{ ...product, quantity: 1 }] } });
  };

  const handleAction = (action, product) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      action === 'buy' ? handleBuyNow(product) : addToCart(product);
    }
  };

  return (
    <div>
      {!isLoggedIn && (
        <div className="welcome-banner">
          <h1>Welcome to GoBuy</h1>
          <p>Your Perfect Buying Partner</p>
        </div>
      )}

      <Box 
        className="product-container"
        sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 3 }}
      >
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="product-card" 
            sx={{ boxShadow: 3, borderRadius: 3, p: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            {/* Product Image */}
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{ objectFit: "contain", height: 200, borderRadius: 2, mb: 1 }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              {/* Title */}
              <Typography variant="h6" gutterBottom noWrap>
                {product.title}
              </Typography>

              {/* Category */}
              <Typography variant="body2" color="text.secondary">
                {product.category}
              </Typography>

              {/* Price */}
              <Typography variant="h6" color="primary" sx={{ mt: 1, mb: 1 }}>
                ${product.price}
              </Typography>

              {/* Rating & Reviews */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Rating 
                  name="read-only" 
                  value={product.rating?.rate ?? 0} 
                  precision={0.5} 
                  readOnly 
                  size="small" 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.rating?.count ?? 0} reviews)
                </Typography>
              </Box>

              {/* Highlighted Rating Chip */}
              <Chip 
                label={`${product.rating?.rate ?? "N/A"} ⭐`} 
                size="small" 
                color="success"
                sx={{ fontWeight: "bold", mb: 1 }}
              />
            </CardContent>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1, p: 2, pt: 0 }}>
              <Button 
                fullWidth
                onClick={() => handleAction('cart', product)}
                variant="outlined"
                color="primary"
              >
                ADD TO CART
              </Button>
              <Button 
                fullWidth
                onClick={() => handleAction('buy', product)}
                variant="contained"
                color="success"
              >
                BUY NOW
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default ProductPage;
