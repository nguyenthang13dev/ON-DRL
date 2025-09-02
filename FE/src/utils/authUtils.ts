/**
 * Utility functions for authentication
 */

/**
 * Kiểm tra token có tồn tại và còn hiệu lực hay không
 * @returns boolean - true nếu token hợp lệ, false nếu không
 */
export const isTokenValid = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const token = getAccessTokenFromBrowser();
  if (!token) {
    return false;
  }

  try {
    // Decode JWT token để kiểm tra expiration
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Kiểm tra token còn hạn hay không (exp là timestamp)
    if (tokenPayload.exp && tokenPayload.exp > currentTime) {
      return true;
    }

    // Nếu token hết hạn, xóa nó
    removeAccessToken();
    return false;
  } catch (error) {
    // Nếu không thể decode token thì coi như token không hợp lệ
    console.error("Error decoding token:", error);
    removeAccessToken();
    return false;
  }
};

/**
 * Kiểm tra user đã đăng nhập hay chưa
 * @returns boolean - true nếu user đã đăng nhập, false nếu chưa
 */
export const isUserAuthenticated = (): boolean => {
  return isTokenValid();
};

/**
 * Xóa token khỏi localStorage và cookie khi hết hạn
 */
export const clearExpiredToken = (): void => {
  removeAccessToken();
};

/**
 * Set token to both localStorage and cookie
 * @param token - JWT token
 */
export const setAccessToken = (token: string): void => {
  if (typeof window !== "undefined") {
    // Lưu vào localStorage
    localStorage.setItem("AccessToken", token);
    
    // Lưu vào cookie để middleware có thể truy cập
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Token expires in 7 days
    document.cookie = `AccessToken=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }
};

/**
 * Remove token from both localStorage and cookie
 */
export const removeAccessToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("AccessToken");
    // Xóa cookie bằng cách set expires về quá khứ
    document.cookie = "AccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

/**
 * Get token from localStorage with fallback to cookie
 * @returns string | null
 */
export const getAccessTokenFromBrowser = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  
  // Thử lấy từ localStorage trước
  let token = localStorage.getItem("AccessToken");
  
  // Nếu không có trong localStorage, thử lấy từ cookie
  if (!token) {
    const cookieValue = document.cookie
      .split("; ")
      .find(row => row.startsWith("AccessToken="))
      ?.split("=")[1];
    
    if (cookieValue) {
      token = cookieValue;
      // Sync lại với localStorage
      localStorage.setItem("AccessToken", token);
    }
  }
  
  return token;
};

/**
 * Get token from localStorage (legacy function for backward compatibility)
 * @returns string | null
 */
export const getAccessToken = (): string | null => {
  return getAccessTokenFromBrowser();
};