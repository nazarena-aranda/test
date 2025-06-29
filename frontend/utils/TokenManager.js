import * as SecureStore from 'expo-secure-store';

const TokenManager = {
  setToken: async (newToken) => {
    await SecureStore.setItemAsync('auth_token', newToken);
  },
  getToken: async () => {
    return await SecureStore.getItemAsync('auth_token');
  },
  clearToken: async () => {
    await SecureStore.deleteItemAsync('auth_token');
  },
};

export default TokenManager;
