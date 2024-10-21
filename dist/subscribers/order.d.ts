import { EventBusService, OrderService } from "@medusajs/medusa";
interface OrderSubscriberArgs {
    eventBusService: EventBusService;
    orderService: OrderService;
}
interface Options {
    key_id: string;
    key_secret: string;
}
declare class OrderSubscriber {
    private eventBus_;
    private orderService;
    private razorpay;
    constructor({ eventBusService, orderService }: OrderSubscriberArgs, options: Options);
}
export default OrderSubscriber;
