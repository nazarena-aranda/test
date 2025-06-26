let token = null;

const TokenManager = {
    setToken: (newToken) => {
        token = newToken;
    },
    getToken: () => {
        return token;
    },
    clearToken: () => {
        token = null;
    }
};

export default TokenManager;