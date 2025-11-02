"use client";

import use2FA from "@/hooks/use2FA";
import useCountDown from "@/hooks/useCountDown";
import { authService } from "@/services/auth/auth.service";
import
    {
        ClockCircleOutlined,
        SafetyOutlined
    } from "@ant-design/icons";
import
    {
        Button,
        Divider,
        Form,
        Input,
        message,
        Modal,
        Typography
    } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import { useCallback, useEffect, useState } from "react";

const { Text, Title } = Typography;

interface TwoAuthComponentProps {
    open: boolean;
    onVerify?: () =>void;
    onCancel?: () => void;
    loading?: boolean;
    title?: string;
    description?: string;
    countdownDuration?: number;
}

const TwoAuthComponent = ({ 
    open, 
    onVerify,
    onCancel,
    loading = false,
    title = "Xác thực 2FA",
    description = "Vui lòng nhập mã OTP để tiếp tục",
    countdownDuration = 120 
}: TwoAuthComponentProps ) =>
{
    
    const [form] = Form.useForm();
    const [otpValue, setOtpValue] = useState<string>("");
    const [verifying, setVerifying] = useState<boolean>(false);
    const [resending, setResending] = useState<boolean>(false);
    const { countdown, startCountdown, stopCountDown } = useCountDown();

    const { open2FA, closeModal, openModal } = use2FA();

    // Start countdown when modal opens
    useEffect(() => {
        if (open) {
            startCountdown(countdownDuration);
            setOtpValue("");
            form.resetFields();
        } else {
            stopCountDown();
        }
    }, [open, startCountdown, stopCountDown, countdownDuration, form]);

    const onChange: OTPProps['onChange'] = (text) => {
        console.log('OTP onChange:', text);
        setOtpValue(text);
    };


    const handleVerify = useCallback(async () => {
        if (!otpValue) {
            message.error("Vui lòng nhập đầy đủ mã OTP 6 số!");
            return;
        }
        try {
            setVerifying( true );
            
            if(countdown <= 0) {
                message.error("Mã OTP đã hết hạn, vui lòng yêu cầu mã mới!");
                return;
            }
            const response = await authService.CheckOtp({
                otpCode: otpValue
            });
            if (response.status) {
                message.success( "Xác thực thành công!" );
                onVerify?.();
            } else {
                message.error(response.message || "Mã OTP không đúng, vui lòng thử lại!");
            }
        } catch ( error )
        {
            message.error("Xác thực thất bại!");
        } finally {
            setVerifying(false);
        }
    }, [ otpValue, onVerify, form ] );


    const handleResend = () =>
    {
        startCountdown();
    }


    const handleCancel = useCallback(() => {
        form.resetFields();
        setOtpValue("");
        stopCountDown();
        onCancel?.();
    }, [form, stopCountDown, onCancel]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    return (
        <Modal 
            open={open} 
            footer={null} 
            onCancel={handleCancel}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SafetyOutlined style={{ color: '#1890ff' }} />
                    {title}
                </div>
            }
            width={500}
            centered
            maskClosable={false}
            destroyOnClose
        >
            <div style={{ padding: '20px 0' }}>
                {/* Description */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                     {description}
                </div>

                <Form form={form} layout="vertical">
                    <Form.Item 
                        name="otp"
                        rules={[
                            { required: true, message: "Vui lòng nhập mã OTP!" },
                            // { len: 6, message: "Mã OTP phải có 6 số!" }
                        ]}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Input.OTP 
                                formatter={(str) => str.replace(/\D/g, '')} 
                                {...sharedProps}
                                value={otpValue}
                            />
                        </div>
                    </Form.Item>

                    {/* Countdown Timer */}
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        {countdown > 0 ? (
                            <>
                                <ClockCircleOutlined style={{ marginRight: 4, color: '#faad14' }} />
                              Mã có hiệu lực trong: {formatTime(countdown)}
                            </>
                        ) : (
                            <Text type="danger">
                                Mã OTP đã hết hạn
                            </Text>
                        )}
                    </div>

                    <Divider />

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={countdown <= 0 ? handleResend : handleVerify}
                        >
                            {countdown <= 0 ? "Gửi lại mã OTP" : "Xác thực"}
                        </Button>

                        <Button
                            size="large"
                            onClick={handleCancel}
                            disabled={verifying || resending || loading}
                            style={{ minWidth: 80 }}
                        >
                            Hủy
                        </Button>
                    </div>
                </Form>
                
            </div>
        </Modal>


        
        
    );
};

export default TwoAuthComponent;