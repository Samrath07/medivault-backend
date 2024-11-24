const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pharma Management API',
            version: '1.0.0',
            description: 'API documentation for the Pharma Management system',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to your API files
};

module.exports = options;
