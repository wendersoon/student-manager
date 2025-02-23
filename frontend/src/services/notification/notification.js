import Swal from 'sweetalert2';

export const NotificationService = {
    success: (message) => {
        Swal.fire({
            title: 'Sucesso',
            text: message,
            icon: 'success',
            confirmButtonColor: '#3B82F6',
            confirmButtonText: 'OK'
        });
    },
    error(message) {
        return Swal.fire({
            title: 'Erro!',
            text: message,
            icon: 'error',
            confirmButtonColor: '#3B82F6',
            confirmButtonText: 'OK'
        });
    },
    confirm(message) {
        return Swal.fire({
            title: 'Confirmação',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        });
    }
};
