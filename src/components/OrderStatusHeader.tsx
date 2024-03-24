import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";

type OrderStatusHeaderPropsT = {
  order: Order;
};
const OrderStatusHeader = ({ order }: OrderStatusHeaderPropsT) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime
    );
    const hours = created.getHours();
    const minutes = created.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    );
  };

  return (
    <>
      <h1 className="text-xl tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
        <span>
          <span className="font-semibold">Order status:</span>{" "}
          <span className="tracking-tight">{getOrderStatusInfo().label}</span>
        </span>
        <span className="font-normal text-base">
          <span className="font-semibold">Expected by:</span>{" "}
          <span className="tracking-tight">{getExpectedDelivery()}</span>
        </span>
      </h1>
      <Progress
        value={getOrderStatusInfo().progressValue}
        className="animate-pulse"
      />
    </>
  );
};

export default OrderStatusHeader;
