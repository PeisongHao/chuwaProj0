// 测试优惠码API
const axios = require('axios');

const testPromoCode = async (promoCode) => {
  try {
    console.log(`\n测试优惠码: ${promoCode}`);
    
    // 首先登录获取token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'testuser',
      password: 'testpass123'
    });
    
    const token = loginResponse.data.token;
    console.log('登录成功，token:', token.substring(0, 20) + '...');
    
    // 测试优惠码
    const promoResponse = await axios.post('http://localhost:3000/api/cart/promo', {
      promoCode: promoCode
    }, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('优惠码应用成功:', promoResponse.data);
    
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
};

// 测试多个优惠码
const testPromoCodes = async () => {
  const codes = ['BULK30', 'WEEKEND', 'WELCOME10', 'INVALID'];
  
  for (const code of codes) {
    await testPromoCode(code);
  }
};

testPromoCodes();
