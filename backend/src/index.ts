const express = require('express');
const cors = require('cors');
const app = express();

// Define the allowed origin
const allowedOrigins = ['http://localhost:5173','http://localhost:5174','https://gen-ai-foundation-demo-cec4ghc4aeesbjba.a03.azurefd.net'];


// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Example route
app.get('/api/initiative/:id', (req, res) => {
  res.json({ message: 'CORS is configured correctly!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

