"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
class OrderSubscriber {
    constructor({ eventBusService, orderService }, options) {
        this.eventBus_ = eventBusService;
        this.orderService = orderService;
        this.razorpay = new razorpay_1.default({
            key_id: options.key_id,
            key_secret: options.key_secret
        });
        this.eventBus_.subscribe("order.placed", async (orderEvent) => {
            const order = await this.orderService.retrieve(orderEvent.id, {
                'relations': ['cart', 'payments']
            }).catch(() => null);
            if (!order) {
                console.log("Razorpay Module: Order not found");
                return;
            }
            const razorpayOrderId = order.payments[0].data.id;
            const cartId = order.payments[0].cart_id;
            if (!razorpayOrderId || !cartId) {
                console.log("Razorpay Module: order id or cart id is not present");
                return;
            }
            const razorpayOrder = await this.razorpay.orders.fetch(razorpayOrderId);
            if (razorpayOrder && razorpayOrder.status === "paid" && (order.payment_status === "awaiting" || order.payment_status === "not_paid")) {
                this.orderService.capturePayment(orderEvent.id);
                return;
            }
            console.log("Razorpay Module: Order is not paid or not in awaiting state");
        });
    }
}
exports.default = OrderSubscriber;
