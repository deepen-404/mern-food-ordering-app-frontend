import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant,
} from "@/api/myRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForms from "@/forms/mange-restarurant-form/ManageRestaurantForm";
import { TabsContent } from "@radix-ui/react-tabs";
import { Loader2 } from "lucide-react";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateMyRestaurant();
  const { restaurant, isLoading: isGetLoading } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();
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
          {orders?.length === 0 ? "No" : orders?.length} active orders
        </h2>
        {orders?.reverse().map((order) => (
          <OrderItemCard order={order} />
        ))}
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
