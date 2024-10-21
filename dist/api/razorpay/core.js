"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
exports.default = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const logger = req.scope.resolve("logger");
    const webhookSignature = req.headers["x-razorpay-signature"];
    if (!webhookSignature) {
        res.sendStatus(400);
        return;
    }
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    try {
        const body = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf-8')) : req.body;
        logger.info(`Received Razorpay: ${JSON.stringify(body)}`);
        await wait(30000);
        const validationResponse = razorpay_1.default.validateWebhookSignature(JSON.stringify(body), webhookSignature, webhookSecret);
        if (!validationResponse) {
            res.sendStatus(400);
            return;
        }
        const event = body.event;
        const cartId = (_e = (_d = (_c = (_b = (_a = body === null || body === void 0 ? void 0 : body.payload) === null || _a === void 0 ? void 0 : _a.payment) === null || _b === void 0 ? void 0 : _b.entity) === null || _c === void 0 ? void 0 : _c.notes) === null || _d === void 0 ? void 0 : _d.cart_id) !== null && _e !== void 0 ? _e : (_j = (_h = (_g = (_f = body === null || body === void 0 ? void 0 : body.payload) === null || _f === void 0 ? void 0 : _f.payment) === null || _g === void 0 ? void 0 : _g.entity) === null || _h === void 0 ? void 0 : _h.notes) === null || _j === void 0 ? void 0 : _j.resource_id;
        if (!cartId) {
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
                }
                else {
                    logger.warn(`Razorpay webhook received for an order that is not yet created in Medusa: ${order === null || order === void 0 ? void 0 : order.id}`);
                    return res.sendStatus(404);
                }
                break;
            default:
                res.sendStatus(204);
                return;
        }
        res.sendStatus(200);
    }
    catch (error) {
        logger.error(`Razorpay webhook validation failed : ${error}`);
        res.sendStatus(500);
        return;
    }
};
async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
