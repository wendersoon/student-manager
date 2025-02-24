import { NotificationService } from '../services/notification/notification';

export const HandleApiError = (error) => {
  console.log('Error response data:', error.response?.data);
  
  // Verifica se o erro tem uma resposta da API
  if (error.response && error.response.data) {
    const data = error.response.data;
    
    // Caso 1: Erro com campo "detail" específico
    if (data.detail) {
      return NotificationService.error(data.detail);
    }
    
    // Caso 2: Erros de validação em campos específicos
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      // Extrai as mensagens de erro de cada campo
      const errorMessages = [];
      
      // Itera por cada campo no objeto de erro
      for (const [field, errors] of Object.entries(data)) {
        // Formata o nome do campo (primeira letra maiúscula)
        const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
        
        // Se errors é um array, extrai a primeira mensagem (geralmente há apenas uma)
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessages.push(`${formattedField}: ${errors[0]}`);
        } 
        // Se errors é uma string
        else if (typeof errors === 'string') {
          errorMessages.push(`${formattedField}: ${errors}`);
        }
        // Para outros tipos de valores
        else {
          errorMessages.push(`${formattedField}: Erro de validação`);
        }
      }
      
      // Combina todas as mensagens e exibe
      return NotificationService.error(errorMessages.join('\n'));
    }
  }
  
  // Caso 3: Erro genérico ou inesperado
  return NotificationService.error('Ocorreu um erro. Por favor, tente novamente.');
};