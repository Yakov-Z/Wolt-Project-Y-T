const express = require('express');
const app = express();

// Initialize the TCP socket connection to the legacy C++ server
require('./Services/tcpClient');

const UserRoutes = require('./Routes/UserRoutes');
const RestaurantRoutes = require('./Routes/RestaurantsRoutes');
const TokenRoute = require('./Routes/TokensRoutes');
const SearchRoute = require('./Routes/SearchRoutes');
const OrderRoute = require('./Routes/OrderRoutes');


// Middleware to parse JSON bodies automatically
app.use(express.json());

// Prefix all article routes with /api/articles
app.use('/api/users', UserRoutes);
app.use('/api/restaurants', RestaurantRoutes);
app.use('/api/tokens', TokenRoute);
app.use('/api/orders', OrderRoute);
app.use('/api/search', SearchRoute);

// Start server on port 3000
app.listen(3000);