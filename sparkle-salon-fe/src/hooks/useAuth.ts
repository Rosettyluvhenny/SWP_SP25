import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const BASE_URL = 'http://localhost:8081/swp';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from token
  const loadUser = useCallback(async () => {
    if (!authState.token) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      setAuthState({
        user: response.data.result,
        token: authState.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [authState.token]);

  // Load user on initial mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
      const { token, user } = response.data.result;
      
      localStorage.setItem('token', token);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success('Đăng nhập thành công!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401) {
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
        } else {
          toast.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }
      } else {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      }
      
      return false;
    }
  };

  // Register
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axios.post(`${BASE_URL}/auth/register`, data);
      const { token, user } = response.data.result;
      
      localStorage.setItem('token', token);
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast.success('Đăng ký tài khoản thành công!');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 409) {
          toast.error('Tên đăng nhập hoặc email đã tồn tại');
        } else {
          toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
        }
      } else {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      }
      
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.info('Đã đăng xuất');
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!authState.token) {
      toast.error('Bạn cần đăng nhập để thực hiện thao tác này');
      return false;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await axios.put(
        `${BASE_URL}/users/${authState.user?.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user, ...response.data.result } as User,
        isLoading: false,
      }));
      
      toast.success('Cập nhật thông tin thành công!');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error('Cập nhật thông tin thất bại. Vui lòng thử lại sau.');
      return false;
    }
  };

  // Change password
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!authState.token) {
      toast.error('Bạn cần đăng nhập để thực hiện thao tác này');
      return false;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await axios.put(
        `${BASE_URL}/users/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.success('Đổi mật khẩu thành công!');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401) {
          toast.error('Mật khẩu hiện tại không đúng');
        } else {
          toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại sau.');
        }
      } else {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      }
      
      return false;
    }
  };

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };
}; 