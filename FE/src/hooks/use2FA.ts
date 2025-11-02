import { useCallback, useState } from "react";


type Use2FAResult = {
  open: boolean;
  countdown: number;        // seconds left for resend
  startCountdown: (seconds?: number) => void;
  stopCountdown: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
};

const use2FA = () =>
{
    const [ open2FA, setOpen2FA ] = useState<boolean>( false );

    const openModal = useCallback(() =>
    {
        setOpen2FA( true );
    }, [])
    
    const closeModal = useCallback( () =>
    {
        setOpen2FA( false );
    }, [] )
    return {
        open2FA,
        openModal,
        closeModal
    }
}



export default use2FA;