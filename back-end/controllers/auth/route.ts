import express from 'express';
// import verifyJWT from '@middleware/verifyJWT';
import handleRegister from './handlers/register';
// import handleRegisterConfirm from './handlers/register-confirm';
import handleLogin from './handlers/login';
// import handleRefreshToken from './handlers/refresh-token';
// import handleLogout from './handlers/logout';
// import handleSendActivateLink from './handlers/send-activate-link';
const router = express.Router();

router.post('/register', handleRegister);
// router.get('/register-confirm/:emailActiveCode', handleRegisterConfirm);
router.post('/login', handleLogin);
// router.post('/refresh-token', handleRefreshToken);
// router.post('/logout', handleLogout);
// router.use(verifyJWT);
// router.post('/send-activate-link', handleSendActivateLink);

export default router;
