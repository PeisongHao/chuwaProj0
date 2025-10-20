/**
 * 模拟认证功能 - 用于独立开发测试
 */

// 模拟用户登录
export const mockLogin = async (username, password) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟登录成功
  if (username && password) {
    return {
      success: true,
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 'mock_user_id',
        username: username,
        role: 'regular'
      },
      message: 'Login successful'
    };
  }
  
  throw new Error('Invalid credentials');
};

// 模拟获取用户信息
export const mockGetUserInfo = async (token) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (token && token.startsWith('mock_jwt_token_')) {
    return {
      id: 'mock_user_id',
      username: 'testuser@example.com',
      role: 'regular'
    };
  }
  
  throw new Error('Invalid token');
};

// 模拟登出
export const mockLogout = () => {
  return {
    success: true,
    message: 'Logout successful'
  };
};

// 检查token是否有效
export const isTokenValid = (token) => {
  return token && token.startsWith('mock_jwt_token_');
};
