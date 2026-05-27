import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.ts";
import { paymentIntent, webhook } from "../controllers/payment.controller.ts";


const router = Router();

router.post("/create-payment-intent", paymentIntent);
router.post("/webhook", webhook);

export default router;
