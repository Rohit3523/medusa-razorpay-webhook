import Razorpay from "razorpay";
import { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve("logger") as Logger;
    const webhookSignature = req.headers["x-razorpay-signature"] as string;

    if(!webhookSignature) {
        res.sendStatus(400);
        return;
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    try {
        const body = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf-8')) : req.body;

        logger.info(`Received Razorpay: ${JSON.stringify(body)}`);

        await wait(15000);

        const validationResponse = Razorpay.validateWebhookSignature(
            JSON.stringify(body),
            webhookSignature,
            webhookSecret
        );
        
        if (!validationResponse) {
            res.sendStatus(400);
            return;
        }

        const event = body.event;

        const cartId = body?.payload?.payment?.entity?.notes?.cart_id ?? body?.payload?.payment?.entity?.notes?.resource_id;
        if(!cartId) {
            res.sendStatus(400);
            return;
        }

        const orderService = req.scope.resolve("orderService");

        const order = await orderService
            .retrieveByCartId(cartId)
            .catch(() => undefined);

        switch (event) {
            case "payment.failed":
                if (order) {
                    await orderService.update(order.id, {
                        status: "requires_action",
                    });
                }
                break;

            // Order is not yet created in Medusa when webhook fires the first time.
            // Therefore we send 404 response to trigger Razorpay retry
            case "payment.captured":
                if (order && order.payment_status !== "captured") {
                    await orderService.capturePayment(order.id);
                } else {
                    logger.warn(
                        `Razorpay webhook received for an order that is not yet created in Medusa: ${order?.id}`
                    );
                    return res.sendStatus(404);
                }
                break;

            default:
                res.sendStatus(204);
                return;
        }

        res.sendStatus(200);
    } catch (error) {
        logger.error(`Razorpay webhook validation failed : ${error}`);
        res.sendStatus(500);
        return;
    }
};

async function wait(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}