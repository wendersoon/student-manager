import api from '../api';

export const ClassService = {
    async getClasses() {
        try {
            const response = await api.get('/classes');
            return response.data.map(classItem => ({
                id: classItem.id,
                name: classItem.name,
                description: classItem.description,
                year: classItem.year,
                start_date: classItem.start_date,
                end_date: classItem.end_date,
                is_active: classItem.is_active,
                created_at: classItem.created_at,
                created_by: classItem.created_by
            }));
        } catch (error) {
            throw error;
        }
    },

    async deleteClass(id) {
        try {
            await api.delete(`classes/${id}/`);
        } catch (error) {
            throw error;
        }
    },

    async createClass(classData) {
        try {
            const response = await api.post('classes/', classData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateClass(id, classData) {
        try {
            const response = await api.patch(`classes/${id}/`, classData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};