import Favorite from '../models/Favorite.js';

export const addToFavorites = async (req, res) => {
  try {
    const { recipeId, title, image } = req.body;
    
    const newFav = await Favorite.create({
      userId: req.userId, 
      recipeId,
      title,
      image
    });

    res.status(201).json({ success: true, data: newFav });
  } catch (error) {
    res.status(400).json({ success: false, message: "Already in favorites or error occurred" });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId });
    res.status(200).json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};