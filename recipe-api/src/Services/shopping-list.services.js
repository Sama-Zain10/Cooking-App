import shoppinglist from '../models/shopping-list.js';
export const getMyList = async (req, res) => {
  try {
    const shoppinglist = await shoppinglist.findOne({ userId: req.userId });
    
    if (!cart) {
      return res.status(200).json({ success: true, ingredients: [] });
    }

    res.status(200).json({ success: true, ingredients: cart.ingredients });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching shopping list" });
  }
};
export const getMyShoppingList = async (req, res) => {
  try {
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const items = await ShoppingItem.find({ userId: userId });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const saveList = async (req, res) => {
  try {
    const { ingredients } = req.body; 

    const updatedCart = await shoppinglist .findOneAndUpdate(
      { userId: req.userId },
      { ingredients },
      { new: true, upsert: true }
    );
    res.status(200).json({
      success: true,
      message: "Shopping list saved successfully",
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving shopping list" });
  }
};
export const clearList = async (req, res) => {
  try {
    await shoppinglist.findOneAndDelete({ userId: req.userId });
    res.status(200).json({ success: true, message: "Shopping list cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing shopping list" });
  }
};