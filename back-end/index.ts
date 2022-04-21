import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3500;

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Serve static files
app.use('/', express.static(path.join(__dirname, '..', 'front-end', 'build')));
const router = express.Router();
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
});
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
