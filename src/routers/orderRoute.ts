import express from "express";
import { validateJWT } from "../middlewares/validateJWT";
import { checkout } from "../services/orderService";

const router = express.Router();

router.post("/checkout", validateJWT,async (req, res) => {
    const userId = req.userId
    const {address} = req.body
    if(!address){
        return res.status(400).json({message: "Address is required"})
    }
    const {statusCode, data} = await checkout({userId,address})
    if(statusCode !== 200){
        return res.status(statusCode).json({message: data})
    }
    return res.status(statusCode).json({
        message: 'order complete',
        data})
    
})

export default router;