import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useMutation } from "react-query";
import { toast } from "sonner";

type CheckoutSessionRequestT = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();
  const createCheckoutSessionRequest = async (checkoutSessionRequest:CheckoutSessionRequestT) => {
    const accessToken = await getAccessTokenSilently();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/order/checkout/create-checkout-session`,
        JSON.stringify(checkoutSessionRequest),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Unable to create stripe session");
    }
  };

  const {
    mutateAsync: createCheckoutSession,
    isLoading,
    error,
    reset,
  } = useMutation(createCheckoutSessionRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    createCheckoutSession,
    isLoading,
  };
};
