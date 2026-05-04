import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { addToFavorites, deleteFromFavorites, getMyFavorites } from '../Services/favorites.service.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyFavorites)
  .post(protect, addToFavorites);
router.route('/:recipeId')       
  .delete(protect, deleteFromFavorites);
export default router;