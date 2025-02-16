export const LANDING_PAGE_TUTORIAL_KEY = "landing-page-tutorial";

import { DriverStepPropsType } from '@/components/DriverJS/components/DriverStep';

type HeaderKeys = 'login-button' | 'search-bar';

export const LANDING_PAGE_DRIVER_OPTIONS: Record<HeaderKeys, DriverStepPropsType & { driverKey: string }> = {
    'login-button': {
        driverKey: 'login-button',
        stepIndex: 0,
        popover: {
            title: 'Login & Signup',
            description: 'Log in to access your account or sign up to create a new one and start exploring features.',
        },
    },
    'search-bar': {
        driverKey: 'search-bar',
        stepIndex: 1,
        popover: {
            title: 'Search Bar',
            description: 'Easily find restaurants by entering their name or location to get relevant results.',
            side: 'top',
        },
    },
};
