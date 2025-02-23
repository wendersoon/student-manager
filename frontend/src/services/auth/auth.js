import api from '../api';

export const AuthService = {
    async login(email, password) {
        try {
            const response = await api.post('/token/', {
                email,
                password,
            });
            const token = response.data.access;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userRole', response.data.role);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        window.location = '/login';
    },

    isAuthenticated() {
        return sessionStorage.getItem('token') !== null;
    },

    getUserRole() {
        return sessionStorage.getItem('userRole');
    }
};
