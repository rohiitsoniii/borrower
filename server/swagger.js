import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Borrowing Insights APIs',
        description: 'APIs for the Borrowing Insights application - Express.js backend with MongoDB for book borrowing analytics',
        version: '1.0.0',
    },
    host: 'localhost:5000',
    basePath: '/api',
    schemes: ['http', 'https'],
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['application/json'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your bearer token in the format: Bearer {token}'
        }
    },
    tags: [
        {
            name: 'Books',
            description: 'Book management operations'
        },
        {
            name: 'Users',
            description: 'User management operations'
        },
        {
            name: 'Analytics',
            description: 'Analytics and reporting operations'
        }
    ]
};

const outputFile = './swagger.json';
// Point to the route files directly
const endpointsFiles = [
    './routes/bookRoutes.js',
    './routes/userRoutes.js',
    './routes/analyticsRoutes.js'
];

// Custom function to modify paths and add route prefixes
const customOptions = {
    // Add route prefixes to paths
    beforePaths: (paths) => {
        const modifiedPaths = {};
        
        // Add /books prefix to book routes
        for (const path in paths) {
            if (path === '/' || path === '/borrow' || path === '/return' || path === '/borrowed') {
                modifiedPaths[`/books${path === '/' ? '' : path}`] = paths[path];
            } else if (path === '/login' || path === '/register' || path === '/borrowing-info') {
                modifiedPaths[`/users${path === '/' ? '' : path}`] = paths[path];
            } else if (path === '/top-users' || path === '/daily-borrows') {
                modifiedPaths[`/analytics${path === '/' ? '' : path}`] = paths[path];
            } else {
                modifiedPaths[path] = paths[path];
            }
        }
        
        return modifiedPaths;
    }
};

swaggerAutogen(outputFile, endpointsFiles, doc, customOptions);