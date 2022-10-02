const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:8080'];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    callback(null, true);
    // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    // } else {
    //   callback(new Error('Not allowed by CORS'));
    // }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
