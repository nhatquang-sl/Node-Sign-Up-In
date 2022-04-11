import express from 'express';
import handleRegister from './handlers/register';
import handleLogin from './handlers/login';
import handleRefreshToken from './handlers/refresh-token';
import handleLogout from './handlers/logout';
const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/refresh-token', handleRefreshToken);
router.post('/logout', handleLogout);

export default router;
