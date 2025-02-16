import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant,
} from '@/api/myRestaurantApi';
import { DriverProvider } from '@/components/DriverJS/provider/DriverProvider';
import OrderItemCard from '@/components/OrderItemCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DEFAULT_DRIVER_OPTIONS } from '@/config/DriverJS/DefaultDriverJSOptions';
import { ORDER_MANAGEMENT_TUTORIAL_KEY } from '@/config/DriverJS/OrderManagementPage';
import ManageRestaurantForms from '@/forms/mange-restarurant-form/ManageRestaurantForm';
import { TabsContent } from '@radix-ui/react-tabs';
import { Loader2 } from 'lucide-react';

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } = useCreateMyRestaurant();
  const { restaurant, isLoading: isGetLoading } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } = useUpdateMyRestaurant();
  const { orders, isLoading: isOrdersLoading } = useGetMyRestaurantOrders();

  if (isGetLoading || isOrdersLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const isEditing = !!restaurant;

  return (
    <Tabs defaultValue="orders">
      <TabsList className="mb-4">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 border border-gray-900 shadow-sm p-10 rounded-lg"
      >
        <h2 className="text-lg font-semibold">
          {orders?.length === 0 ? 'No' : orders?.length} active orders
        </h2>
        <DriverProvider
          tutorialKey={ORDER_MANAGEMENT_TUTORIAL_KEY}
          driverOptions={{ ...DEFAULT_DRIVER_OPTIONS }}
        >
          {orders?.reverse().map((order) => <OrderItemCard key={order._id} order={order} />)}
        </DriverProvider>
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForms
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
