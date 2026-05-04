import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware لحماية المسارات (Routes) والتأكد من هوية المستخدم
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. التأكد من وجود التوكن في الـ Headers (Bearer Token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // بنفصل كلمة Bearer عن التوكن نفسه
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. لو مفيش توكن، نرجع 401 (Unauthorized)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 3. التحقق من صحة التوكن وفك التشفير
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. البحث عن المستخدم في قاعدة البيانات (بدون إرجاع الباسورد)
    // بنستخدم decoded.id لأننا بنخزن الـ ID جوه التوكن وقت الـ Login
    const currentUser = await User.findById(decoded.id).select("-password");

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 5. تخزين بيانات اليوزر في الـ Request عشان نقدر نستخدمها في الـ Controllers
    req.user = currentUser;
    req.userId = currentUser._id; // مفيد جداً للـ Favorites والـ Shopping List

    next(); // انقل للـ Controller اللي بعده
  } catch (error) {
    // التعامل مع حالات انتهاء التوكن أو التلاعب فيه
    let message = "Not authorized, token failed";
    
    if (error.name === 'TokenExpiredError') {
      message = "Token expired, please login again";
    } else if (error.name === 'JsonWebTokenError') {
      message = "Invalid token, authorization denied";
    }

    return res.status(401).json({
      success: false,
      message: message,
    });
  }
};