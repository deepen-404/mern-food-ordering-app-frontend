import { FC, ReactNode, useEffect, useRef } from 'react';

import { useDriver } from '../hooks/useDriver';
import { DriverStepType } from '../provider/DriverProvider';

export type DriverStepPropsType = Omit<DriverStepType, 'element'> & {
    children?: ReactNode;
    stepIndex: number;
    driverKey: number | string;
    className?: string;
};

export const DriverStep: FC<DriverStepPropsType> = ({ children, stepIndex, className = '', ...driverStepProps }) => {
    const refStep = useRef<HTMLDivElement | null>(null);

    const { setSteps } = useDriver();

    useEffect(() => {
        setSteps((prevSteps) => {
            const newSteps = [...prevSteps];

            newSteps[stepIndex] = { ...driverStepProps, ...(refStep.current ? { element: refStep.current } : {}) };

            return newSteps;
        });
    }, [setSteps]);

    return (
        <div className={className} ref={refStep}>
            {children}
        </div>
    );
};
