'use client';
import React, {useState} from 'react';
import {ChangePasswordType} from '@/types/auth/User';
import {Alert, Button, Form, FormProps, Input} from 'antd';
import {userService} from '@/services/user/user.service';
import {toast} from 'react-toastify';
import {useSelector} from '@/store/hooks';
import {setIsLoading, setShowMessage} from '@/store/general/GeneralSlice';
import {AppDispatch} from '@/store/store';
import {useDispatch} from 'react-redux';
import classes from './page.module.css';
import {LockOutlined} from '@ant-design/icons';
import CustomCard from './CustomCard';

const ChangePassword: React.FC = () => {
    const [form] = Form.useForm<ChangePasswordType>();
    const showMessage = useSelector((state) => state.general.showMessage);
    const [message, setMessage] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const [type, setType] = useState<'success' | 'error'>('success');

    const onFinish: FormProps<ChangePasswordType>['onFinish'] = async (
        values
    ) => {
        dispatch(setIsLoading(true));
        try {
            const response = await userService.ChangePassword(values);

            if (response.status) {
                dispatch(setShowMessage(true));
                setType('success');
                setMessage(
                    'Đổi mật khẩu thành công, vui lòng đăng xuất khỏi hệ thống và đăng nhập lại để hoàn tất cập nhật '
                );
                form.resetFields();
                toast.success('Đổi mật khẩu thành công');
            } else {
                setMessage(response.message || '');
                dispatch(setShowMessage(true));
                setType('error');
            }
        } catch (err) {
            setMessage('Lỗi');
        }
    };

    const onFinishFailed: FormProps<ChangePasswordType>['onFinishFailed'] = (
        errorInfo
    ) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className={`${classes.cardWrapper} py-8`}>
                <CustomCard
                    title="Đổi mật khẩu"
                    className="bg-white !w-full md:!w-2/3 lg:!w-1/2 m-auto shadow-md rounded-xl transition-all hover:shadow-lg border border-gray-100"
                    icon={<LockOutlined className="text-blue-500 mr-2"/>}
                >
                    <div className="px-4 py-2">
                        <Form
                            name="basic"
                            labelCol={{span: 24, md: 8}}
                            wrapperCol={{span: 24, md: 16}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className={`${classes.passwordForm}`}
                            layout="horizontal"
                        >
                            {showMessage && (
                                <Alert
                                    type={type}
                                    showIcon
                                    message={message}
                                    className={`${classes.mgbottom10} rounded-lg mb-6 shadow-sm`}
                                />
                            )}

                            <Form.Item<ChangePasswordType>
                                label={<span className="text-gray-700 font-medium">Mật khẩu cũ</span>}
                                name="oldPassword"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập thông tin này!'},
                                ]}
                                className="w-full mb-6"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400"/>}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="rounded-lg h-11 shadow-sm hover:border-blue-400 focus:border-blue-500"
                                />
                            </Form.Item>

                            <Form.Item<ChangePasswordType>
                                label={<span className="text-gray-700 font-medium">Mật khẩu mới</span>}
                                name="newPassword"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập thông tin này!'},
                                    {min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!'},
                                ]}
                                className="mb-6"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400"/>}
                                    placeholder="Nhập mật khẩu mới"
                                    className="rounded-lg h-11 shadow-sm hover:border-blue-400 focus:border-blue-500"
                                />
                            </Form.Item>

                            <Form.Item<ChangePasswordType>
                                label={<span className="text-gray-700 font-medium">Nhập lại mật khẩu mới</span>}
                                name="confirmPassword"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập thông tin này!'},
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                        },
                                    }),
                                ]}
                                className="mb-2"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400"/>}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="rounded-lg h-11 shadow-sm hover:border-blue-400 focus:border-blue-500"
                                />
                            </Form.Item>

                            <Form.Item
                                label={null}
                                className="!text-center mt-10"
                                wrapperCol={{span: 24}}
                            >
                                <Button
                                    type="primary"
                                    className="mt-2"
                                    htmlType="submit"
                                >
                                    Xác nhận
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </CustomCard>
            </div>
        </>
    );
};
export default ChangePassword;

function dispatch(arg0: { payload: any; type: 'customizer/setIsLoading' }) {
    throw new Error('Function not implemented.');
}
