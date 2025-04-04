import express, { Router } from 'express';
import { login, signup, logout } from '../controllers/auth-controller';

const router: Router = express.Router({
  caseSensitive: true,
  strict: true
});

router.post('/login', login);
router.post('/signup', signup);
router.get('/logout/:id', logout);

export default router;
