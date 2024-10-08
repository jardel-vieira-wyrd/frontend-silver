export enum StatusText {
  TO_DO = 'To Do',
  DOING = 'In Progress',
  DONE = 'Completed',
  CANCELED = 'Canceled'
}

export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'TO_DO': return 'bg-blue-100 text-blue-800';
    case 'DOING': return 'bg-yellow-100 text-yellow-800';
    case 'DONE': return 'bg-green-100 text-green-800';
    case 'CANCELED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function getPriorityColor(priority: number | null): string {
  const colors = [
    'bg-white text-gray-800',
    'bg-red-50 text-red-800',
    'bg-red-100 text-red-800',
    'bg-red-200 text-red-800',
    'bg-red-300 text-red-800',
    'bg-red-400 text-red-800'
  ];
  
  if (priority === null) {
    return colors[0];
  }
  
  return colors[priority] || colors[0];
}
