import { Order } from "@/types";
import { Separator } from "@radix-ui/react-separator";
import { Dot } from "lucide-react";

type OrderStatusDetailPropsT = {
  order: Order;
};

const OrderStatusDetail = ({ order }: OrderStatusDetailPropsT) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-semibold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">Your Order</span>
        <ul>
          {order.cartItems.map((item) => (
            <li className="flex flex-row">
              <Dot /> {item.name} x{item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-semibold">Total</span>
        <span>${(order.totalAmount / 100).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
