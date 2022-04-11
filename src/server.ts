import express from 'express';
import path from 'path';
import authRoute from './controllers/auth/route';
import dbContext from './database';

const app = express();
const PORT = process.env.PORT || 3500;

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Serve static files
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoute);

dbContext.connect();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
