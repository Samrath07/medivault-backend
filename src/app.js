const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./auth/authRoutes');
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const wholesalerRoutes = require('./routes/wholesalerRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const orderRoutes = require('./routes/orderRoutes');



const swaggerConfig = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pharma Management API',
            version: '1.0.0',
            description: 'API for managing pharma-related operations',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Adjust the path based on your route files
};

const swaggerDocs = swaggerJsDoc(swaggerConfig); // Initialize Swagger docs

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wholesalers', wholesalerRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
