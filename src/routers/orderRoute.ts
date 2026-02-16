import express from "express";
import asyncHandler from "../utils/asyncHandler";
import { validateJWT } from "../middlewares/validateJWT";
import { checkout } from "../services/orderService";
import AppError from "../utils/appError";

const router = express.Router();

router.post("/checkout", validateJWT,asyncHandler(async (req, res) => {
    const userId = req.userId
    const {address} = req.body
    if(!userId){
        throw new AppError('User not found', 404)
    }
    if(!address){
        throw new AppError('Address is required', 400)
    }
    const {statusCode, data} = await checkout({userId,address})

    res.status(200).json({
        message: 'Order completed successfully',
        data
    })
    
}))

export default router;