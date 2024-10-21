import { Router } from "express";
import bodyParser from "body-parser";
import { wrapHandler } from "@medusajs/utils";
import razorpayHooks from "./core";

const route = Router();

route.use(bodyParser.json());
route.use(bodyParser.raw({ type: 'application/octet-stream' }));

export default (app: Router) => {
    app.use("/webhook", route);
    
    route.get("/health", (req, res) => {
        res.sendStatus(200);
    });

    route.post("/razorpay", wrapHandler(razorpayHooks as any));
    
    return app;
};