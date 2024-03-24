import { SearchStateT } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import axios from "axios";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurantById = (restaurantId?: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/restaurant/${restaurantId}`
      );
      return response.data.restaurant;
    } catch (err) {
      throw new Error("Failed to get restaurant");
    }
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchRestaurant",
    getRestaurantByIdRequest,
    { enabled: !!restaurantId }
  );

  return { restaurant, isLoading };
};

export const useSearchRestaurant = (
  searchState: SearchStateT,
  city: string | undefined
) => {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to get restaurant");
    }
  };
  const { data: results, isLoading } = useQuery(
    ["searchRestaurants", searchState],
    createSearchRequest,
    { enabled: !!city }
  );

  return {
    results,
    isLoading,
  };
};
