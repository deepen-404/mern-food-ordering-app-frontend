export const RESTAURANT_PAGE_TUTORIAL_KEY = "restaurant-page-tutorial";

import { DriverStepPropsType } from '@/components/DriverJS/components/DriverStep';

type RestaurantPageKeys = 'search-bar' | 'filter-cuisines' | 'restaurant-list' | 'sort-options';

export const RESTAURANT_PAGE_DRIVER_OPTIONS: Record<RestaurantPageKeys, DriverStepPropsType & { driverKey: string }> = {
    'search-bar': {
        driverKey: 'search-bar',
        stepIndex: 0,
        popover: {
            title: 'Search Bar',
            description: 'Search for restaurants by cuisine or name to find the best match.',
            side: 'top',
        },
    },
    'filter-cuisines': {
        driverKey: 'filter-cuisines',
        stepIndex: 1,
        popover: {
            title: 'Filter by Cuisines',
            description: 'Refine your search by selecting preferred cuisines.',
            side: 'right',
        },
    },
    'sort-options': {
        driverKey: 'sort-options',
        stepIndex: 2,
        popover: {
            title: 'Sorting Options',
            description: 'Sort restaurants based on relevance, delivery time, or other preferences.',
        },
    },
    'restaurant-list': {
        driverKey: 'restaurant-list',
        stepIndex: 3,
        popover: {
            title: 'Restaurant Listings',
            description: 'Browse through available restaurants with details like cuisine, delivery time, and pricing.',
        },
    },
    
};
