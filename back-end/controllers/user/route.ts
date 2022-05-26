import express from 'express';
import verifyJWT from '@middleware/verify-jwt';
import handleGetUserSessions from './handlers/get-user-sessions';
const router = express.Router();

router.use(verifyJWT);
router.get('/sessions', handleGetUserSessions);

export default router;
