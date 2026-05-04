import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getMyList , saveList , clearList  } from '../Services/shopping-list.services.js';

const router = express.Router();

router.use(protect); 

router.route('/')
  .get(getMyList)   
  .post(saveList)  
  .delete(clearList); 

export default router;