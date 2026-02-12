import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { getActiveCartForUser } from "../services/cartService";

const router = express.Router();

router.get("/", validateJWT, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({ message: "User ID missing" });
  }
  const cart = await getActiveCartForUser({ userId });
  res.status(200).json({
    message: "Cart found",
    cart,
  });
});

export default router;
