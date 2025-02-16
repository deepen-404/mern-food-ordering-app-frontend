import { driver, Driver, Config, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

import { createContext, ReactNode, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';

import { useReactiveLocalStorage } from '@/hooks/useReactiveLocalStorage';

export type DriverStepType = DriveStep;
export type DriverType = Driver;
export type DriverOptionsType = Config;

export type DriverContextType = {
    driver?: DriverType;
    setSteps: Dispatch<SetStateAction<DriverStepType[]>>;
};

type DriverProviderType = {
    children: ReactNode;
    driverOptions?: DriverOptionsType;
    enabled?: boolean;
    tutorialKey?: string;
};

const initDriverContext: DriverContextType = {
    setSteps: () => {},
};

export const DriverContext = createContext(initDriverContext);

export const DriverProvider: React.FC<DriverProviderType> = ({ children, driverOptions = {}, tutorialKey }) => {
    const [steps, setSteps] = useState<DriverStepType[]>([]);
    const [tutorialCompleted, setTutorialCompleted] = useReactiveLocalStorage<boolean>(tutorialKey ?? '', false);
    const driverRef = useRef<DriverType | undefined>(undefined);

    useEffect(() => {
        if (tutorialCompleted) return;
        driverRef.current = driver({
            ...driverOptions,
            onDestroyStarted: () => {
                setTutorialCompleted(true);
                driverRef.current?.destroy();
            },
        });
    }, [tutorialCompleted]);

    useEffect(() => {
        if (!tutorialCompleted && steps.length > 0) {
            driverRef.current?.setSteps(steps.filter((step) => Boolean(step)));
            driverRef.current?.drive();
        }
        return () => {
            driverRef.current?.destroy();
        };
    }, [steps]);

    const driverContextValues: DriverContextType = {
        driver: driverRef.current,
        setSteps,
    };

    return <DriverContext.Provider value={driverContextValues}>{children}</DriverContext.Provider>;
};
