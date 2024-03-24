import { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await axios.get(`${API_BASE_URL}/api/my/restaurant`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (err) {
      throw new Error("Failed to get restaurant");
    }
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchMyRestaurant",
    getMyRestaurantRequest
  );

  return { restaurant, isLoading };
};

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurantRequest = async (
    restarurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/my/restaurant`,
        restarurantFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const {
    mutate: createRestaurant,
    isLoading,
    error,
    isSuccess,
  } = useMutation(createMyRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant Created!");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { createRestaurant, isLoading };
};

export const useUpdateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyRestaurantRequest = async (
    restarurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/my/restaurant`,
        restarurantFormData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update restaurant");
    }
  };

  const {
    mutate: updateRestaurant,
    isLoading,
    error,
    isSuccess,
  } = useMutation(updateMyRestaurantRequest);

  if (isSuccess) {
    toast.success("Restaurant Updated!");
  }

  if (error) {
    toast.error("Unable to update restaurant");
  }

  return { updateRestaurant, isLoading };
};

export const useGetMyRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/my/restaurant/order`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch error");
    }
  };

  const { data: orders, isLoading } = useQuery(
    "fetchMyRestaurantOrders",
    getMyRestaurantOrdersRequest
  );

  return {
    orders,
    isLoading,
  };
};

type UpdateStatusOrderRequestT = {
  orderId: string;
  status: string;
};

export const useUpdateOrderStatus = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateOrderStatusRequest = async (
    updateStatusOrderRequestP: UpdateStatusOrderRequestT
  ) => {
    const accessToken = await getAccessTokenSilently();
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequestP.orderId}/status`,
        JSON.stringify({ status: updateStatusOrderRequestP.status }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update status");
    }
  };

  const {
    mutateAsync: updateRestaurantStatus,
    isLoading,
    isError,
    isSuccess,
    reset,
    error,
  } = useMutation(updateOrderStatusRequest);

  if (isSuccess) {
    toast.success("Order status Updated");
  }

  console.log("the error is: ", error);
  if (isError) {
    toast.error("Unable to update order status");
    reset();
  }

  return { updateRestaurantStatus, isLoading };
};
