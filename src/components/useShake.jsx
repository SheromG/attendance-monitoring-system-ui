import { useState } from "react";

const useShake = (duration = 120) => 
{
    const [shake, setShake] = useState(false);

    const triggerShake = () => 
    {
        setShake(false);

        requestAnimationFrame(() => 
        {
            setShake(true);

            setTimeout(() => { setShake(false);}, duration);
        });
    };

    return {
        shake,
        triggerShake,
    };
};

export default useShake;