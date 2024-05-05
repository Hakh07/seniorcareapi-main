module.exports = {
    swagger: '2.0', 
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
                
            },
            post: {
                summary: 'Create a user',
                description: 'Creates a new user',
                
            },
           
        },
        
    },
};
