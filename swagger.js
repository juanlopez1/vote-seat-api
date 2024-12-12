const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'VoteSeat API',
            version: '1.0.0',
            description: 'La API para operar la lógica de negocio detrás de la webapp VoteSeat',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = {
    swaggerSpec,
    swaggerUi,
};
