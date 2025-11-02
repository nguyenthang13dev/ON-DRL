import { useCallback, useRef, useState } from "react";



// Hook dùng để đếm ngược
const useCountDown = () =>
{
    const countdownRef = useRef<number | null>( null );
    const [countdown, setCountdown] = useState<number>(0);


    // Start the countdown
    const startCountdown = useCallback( ( seconds: number = 60 ) =>
    {
        setCountdown( seconds );
        if ( countdownRef.current )
        {
            window.clearInterval( countdownRef.current );
        }
        countdownRef.current = window.setInterval( () =>
        {
            setCountdown( ( pre ) =>
            {
                if ( pre <= 1 )
                {
                    if ( countdownRef.current )
                    {
                        window.clearInterval( countdownRef.current );
                        countdownRef.current = null;
                    }
                    return 0;
                }
                return pre - 1;
            } );
        }, 1000 );
    }, []);

    // Stop countdown
    const stopCountDown = useCallback( () =>
    {
        if ( countdownRef.current )
        {
            window.clearInterval( countdownRef.current );
            countdownRef.current = null;
        }
        setCountdown(0);
    }, [])





    return {
        countdown,
        startCountdown,
        stopCountDown
    }


}
export default useCountDown;