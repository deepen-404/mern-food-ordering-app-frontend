export const RESTAURANT_DETAIL_TUTORIAL_KEY = "restaurant-detail-tutorial";

import { DriverStepPropsType } from '@/components/DriverJS/components/DriverStep';

type RestaurantDetailKeys = 'restaurant-info' | 'menu-list' | 'order-summary' | 'checkout-button';

export const RESTAURANT_DETAIL_DRIVER_OPTIONS: Record<RestaurantDetailKeys, DriverStepPropsType & { driverKey: string }> = {
    'restaurant-info': {
        driverKey: 'restaurant-info',
        stepIndex: 0,
        popover: {
            title: 'Restaurant Information',
            description: 'View the restaurant details, including location, cuisine types, and rating.',
            side: 'top',
        },
    },
    'menu-list': {
        driverKey: 'menu-list',
        stepIndex: 1,
        popover: {
            title: 'Menu List',
            description: 'Browse the available dishes and add items to your cart.',
            side: 'right',
        },
    },
    'order-summary': {
        driverKey: 'order-summary',
        stepIndex: 2,
        popover: {
            title: 'Your Order',
            description: 'Check your selected items and see the total cost, including the delivery charge.',
            side: 'left',
        },
    },
    'checkout-button': {
        driverKey: 'checkout-button',
        stepIndex: 3,
        popover: {
            title: 'Proceed to Checkout',
            description: 'Click here to finalize your order and make a payment.',
            side: 'bottom',
        },
    },
};
