import api from '../api';

export const UserService = {
    async getUsers() {
        try {
            const response = await api.get('/users');
            return response.data.map(
                user => ({
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
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
            // Se não houver senha, podemos removê-la do objeto para não enviar um valor vazio
            if (!userData.password) {
                const { password, ...dataWithoutPassword } = userData;
                const response = await api.patch(`users/${id}/`, dataWithoutPassword);
                return response.data;
            }
            
            // Caso contrário, envia todos os dados incluindo a senha
            const response = await api.patch(`users/${id}/`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}