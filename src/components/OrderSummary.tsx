import { CartItemT } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { Trash } from "lucide-react";

type OrderSummaryPropsT = {
  restaurant: Restaurant;
  cartItems: CartItemT[];
  removeFromCart: (cartItem: CartItemT) => void;
};

const OrderSummary = ({
  restaurant,
  cartItems,
  removeFromCart,
}: OrderSummaryPropsT) => {
  const getTotalCost = () => {
    const total = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
    const totalWithDelivery = total + restaurant.deliveryPrice;

    return (totalWithDelivery / 100).toFixed(2);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight flex justify-between">
          <span>Your Order</span>
          <span>${getTotalCost()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between">
            <span>
              <Badge variant="outline" className="mr-2">
                {item.quantity}
              </Badge>
              {item.name}
            </span>
            <span className="flex items-center gap-1">
              ${((item.price * item.quantity) / 100).toFixed(2)}
              <Trash
                className="cursor-pointer"
                color="red"
                size={18}
                onClick={() => removeFromCart(item)}
              />
            </span>
          </div>
        ))}
        <Separator className="bg-slate-200 h-[0.1rem] w-full" />
        <div className="flex justify-between">
          <span className="text-sm">Delivery charge:</span>
          <span className="text-sm">
            ${(restaurant.deliveryPrice / 100).toFixed(2)}
          </span>
        </div>
        <Separator className="bg-slate-200 h-[0.1rem] w-full" />
      </CardContent>
    </>
  );
};

export default OrderSummary;
