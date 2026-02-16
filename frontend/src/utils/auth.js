export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const getUserRole = () => {
    // In a real app, decode the token to get the role if not stored separately
    // For now, assume role is stored or return null
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || null;
};
