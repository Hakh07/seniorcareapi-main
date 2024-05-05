module.exports = {
    swagger: '2.0', // Or '3.0.0' for OpenAPI 3
    info: {
        version: '1.0.0',
        title: 'User API',
        description: 'API endpoints for user management',
    },
    paths: {
        '/api/users': {
            get: {
                summary: 'Get all users',
                description: 'Retrieves a list of users',
                // ... add details like responses, parameters, etc.
            },
            post: {
                summary: 'Create a user',
                description: 'Creates a new user',
                // ... add details like request body, responses, etc.
            },
            // ... define other methods (PUT, DELETE) for this path if applicable
        },
        // ... define paths and methods for other API endpoints
    },
};
