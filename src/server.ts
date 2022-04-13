import 'dotenv/config';
import 'module-alias/register';
import express from 'express';
import path from 'path';
import authRoute from '@controllers/auth/route';
// https://levelup.gitconnected.com/path-aliases-with-typescript-in-node-js-230803e3f200
import dbContext from '@database';
import User from '@database/models/user';

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

dbContext.connect().then(async () => {
  // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
  await User.sync();
  // await User.sync({ force: true });
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
