import api from '../api';

export const UserService = {
    async getUsers() {
        try {
            const response = await api.get('/users');
            return response.data.map(
                user => ({
                    id: user.id,
                    name: `${user.name} ${user.lastName}`,
                    email: user.email,
                    role: user.role,
                    is_active: user.is_active,
                    created_at: user.created_at,
                })
            );
        } catch (error) {
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            await api.delete(`users/${id}/`);
        } catch (error) {
            throw error;
        }
    },

    async createUser(userData) {
        try {
            const response = await api.post('users/', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateUser(id, userData) {
        try {
            const response = await api.put(`users/${id}/`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}