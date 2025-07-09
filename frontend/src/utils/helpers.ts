import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, 'PPP'); // 'Jan 1, 2022'
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'TODO':
      return 'status-badge status-todo';
    case 'IN_PROGRESS':
      return 'status-badge status-in-progress';
    case 'DONE':
      return 'status-badge status-done';
    default:
      return 'status-badge bg-gray-100 text-gray-800';
  }
};
