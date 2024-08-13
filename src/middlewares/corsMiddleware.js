const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PATCH, DELETE, OPTIONS',
    allowedHeaders:
        'Authorization, Content-Type, X-Customer-Software, X-My-Custom,Accept, Accept-Language',
    credentials: true,
};

export default corsOptions;