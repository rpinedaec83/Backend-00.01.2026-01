import type { NextFunction, Request, Response } from "express";
import Stripe from "stripe";


console.log("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-04-22.dahlia",
});

export const paymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {

    const {amount, currency = "usd"} = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency
    });

    // if (!orders) {
    //   return next(appError(400, "ORDERS_NOT_FOUND", "faltan parametros"));
    // }
    return res.status(200).json({ status: "ok", clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

export const webhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    } 
  } catch (error) {
    next(error);
  }
}



code
: 
"secret_key_required"
message
: 
"This API call cannot be made with a publishable API key. Please use a secret API key. You can find a list of your API keys at https://dashboard.stripe.com/account/apikeys."
status
: 
"error"