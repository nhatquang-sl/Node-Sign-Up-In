import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// Serve static files
let fePath = path.join(__dirname, '..', 'front-end', 'build');
console.log(process.env.NODE_ENV, 'production', process.env.NODE_ENV == 'production');
if (process.env.NODE_ENV == 'production') {
  fePath = path.join(__dirname, '..', '..', 'front-end', 'build');
  console.log('prod', fePath);
}
app.use('/', express.static(fePath));
const router = express.Router();
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(fePath, 'index.html'));
});
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
