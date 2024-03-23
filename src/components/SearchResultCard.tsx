import { Restaurant } from "@/types";
import React from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Link } from "react-router-dom";
import { Banknote, Clock, Dot } from "lucide-react";

type SearchResultCardPropsT = {
  restaurant: Restaurant;
};

const SeachResultCard: React.FC<SearchResultCardPropsT> = ({ restaurant }) => {
  return (
    <Link
      className="grid lg:grid-cols-[2fr_3fr] gap-5 group:"
      to={`detail/${restaurant._id}`}
    >
      <AspectRatio ratio={16 / 6}>
        <img
          src={restaurant.imageUrl}
          alt="Restaurant Image"
          className="rounded-md w-full h-full object-cover"
        />
      </AspectRatio>
      <div>
        <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:underline">
          {restaurant.restaurantName}
        </h3>
        <div id="card__content" className="grid md:grid-cols-2 gap-2 ">
          <div className="flex flex-row flex-wrap text-sm">
            {restaurant.cuisines.map((item, index) => (
              <span className="flex">
                <span>{item}</span>
                {index < restaurant.cuisines.length - 1 && <Dot />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Clock className="text-green-600" />
              {restaurant.estimatedDeliveryTime} min
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Banknote />
              Delivery From ${(restaurant.deliveryPrice / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SeachResultCard;
