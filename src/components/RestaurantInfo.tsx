import { Restaurant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dot } from "lucide-react";

type RestaurantInfoPropsT = {
  restaurant: Restaurant;
};
const RestaurantInfo = ({ restaurant }: RestaurantInfoPropsT) => {
  return (
    <Card className="border-sla">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          {restaurant.restaurantName}
        </CardTitle>
        <CardDescription>
          {restaurant.city}, {restaurant.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap">
        {restaurant.cuisines.map((item, index) => (
          <span key={item} className="flex">
            <span className="text-sm">{item}</span>
            {index < restaurant.cuisines.length - 1 && <Dot />}
          </span>
        ))}
      </CardContent>
    </Card>
  );
};

export default RestaurantInfo;
