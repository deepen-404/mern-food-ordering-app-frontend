import { useGetMyOrders } from '@/api/orderApi';
import OrderStatusDetail from '@/components/OrderStatusDetail';
import OrderStatusHeader from '@/components/OrderStatusHeader';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Loader2 } from 'lucide-react';

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return 'No orders found';
  }

  return (
    <div className="space-y-10">
      {orders.reverse().map((order) => (
        <div className="space-y-10 bg-gray-50 p-10 shadow-sm hover:shadow-md rounded-lg">
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img
                src={order.restaurant.imageUrl}
                className="rounded-md object-cover h-full w-full"
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
