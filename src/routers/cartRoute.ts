import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { addItemToCart, getActiveCartForUser, updateCartItem } from "../services/cartService";
import { zCartItemSchema } from "../validation/cartValidation";

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

router.post('/item',validateJWT, async (req, res) =>  {
  const userId = req.userId
  const {productId, quantity} = req.body
  const {statusCode, data} = await addItemToCart({userId, productId, quantity})
  if(statusCode !== 200){
    return res.status(statusCode).json({
      message : data
    })
  }
  res.status(statusCode).json({
    message : 'added to cart',
    data
  })
})

router.put('/item',validateJWT, async (req, res) => {
  const userId = req.userId
  const {productId, quantity} = req.body
  const {statusCode, data} = await updateCartItem({userId, productId, quantity})
  if(statusCode !== 200){
    return res.status(statusCode).json({
      message : data
    })
  }
  res.status(statusCode).json({
    message : 'updated cart',
    data
  })
})
export default router;
