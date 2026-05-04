import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { addToFavorites, getMyFavorites } from '../Services/favorites.service.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyFavorites)
  .post(protect, addToFavorites);

export default router;