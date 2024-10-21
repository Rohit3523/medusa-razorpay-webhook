import { Router } from "express";
import hook from "./razorpay";

export default () => {
    const app = Router();

    hook(app);

    return app;
};