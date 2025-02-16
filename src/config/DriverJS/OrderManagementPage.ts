export const ORDER_MANAGEMENT_TUTORIAL_KEY = "restaurant-management-tutorial";

import { DriverStepPropsType } from "@/components/DriverJS/components/DriverStep";

type OrderManagementTutorialKeys = "order-status";

export const ORDER_MANAGEMENT_DRIVER_OPTIONS: Record<
  OrderManagementTutorialKeys,
  DriverStepPropsType & { driverKey: string }
> = {
  "order-status": {
    driverKey: "order-status",
    stepIndex: 0,
    popover: {
      title: "Update Order Status",
      description: "Select the current status of the order from the dropdown menu. This will keep customers informed about their order progress.",
      side: "bottom",
    },
  },
};

// Helper type for enforcing valid driver keys
export type RestaurantManagementDriverKeys = keyof typeof ORDER_MANAGEMENT_DRIVER_OPTIONS;