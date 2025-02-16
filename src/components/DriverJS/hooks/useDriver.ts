import { useContext } from 'react';

import { DriverContext, DriverContextType } from '../provider/DriverProvider';

export const useDriver = (): DriverContextType => {
    const { driver, setSteps } = useContext(DriverContext);

    return {
        driver,
        setSteps,
    };
};
