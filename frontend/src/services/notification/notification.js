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
        // Verifica se a mensagem tem múltiplas linhas
        if (message.includes('\n')) {
            // Formata as linhas de erro em uma lista HTML
            const formattedMessage = message
                .split('\n')
                .map(line => `<li class="text-left">${line}</li>`)
                .join('');
                
            return Swal.fire({
                title: 'Erro!',
                html: `<ul class="mt-2">${formattedMessage}</ul>`,
                icon: 'error',
                confirmButtonColor: '#3B82F6',
                confirmButtonText: 'OK'
            });
        }
        
        // Caso seja uma mensagem simples
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