import { ForgotPasswordType, LoginType, OtpType, ResetPasswordType, UserType, createEditType, tableCheckAuthDataType } from '@/types/auth/User';
import { Response } from '@/types/general';
import { apiService } from '../index';

class AuthService {
  public async login(formData: LoginType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Account/Login',
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getInfo(): Promise<Response<UserType>> {
    try {
      const response = await apiService.get<Response<UserType>>(
        '/Account/GetInfo'
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async register(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Account/Register',
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async forgotPassword(formData: ForgotPasswordType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Account/ForgotPassword', formData
      );
      return response.data;
    }
    catch (error) {
      throw error;
    }
  }

  public async resetPassword(formData: ResetPasswordType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/Account/ResetPassword', formData
      );
      return response.data;
    }
    catch (error) {
      throw error;
    }
  }


  public async CheckOtp(formData: tableCheckAuthDataType ): Promise<Response>
  {
    try {
      const response = await apiService.post<Response>(
        '/User/CheckOtp', formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  public async Edit2FA(formData: OtpType): Promise<Response> {
    const response = await apiService.post<Response>(
      '/User/AddOrEditOtp', formData
    );
    return response.data;
  }

}

export const authService = new AuthService();
