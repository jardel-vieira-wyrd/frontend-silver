import React, { useState } from 'react';
import { X, Calendar, Clock, List, AlertCircle, User, Edit } from 'lucide-react';
import { StatusText, getStatusColor } from '../utils/taskUtils';
import { useAuthStore } from '../stores/authStore';
import UserPermissionsModal from './UserPermissionsModal';

// Update the Task interface to include userPermissions
interface Task {
  id: number;
  title: string;
  project: string;
  description: string;
  status: string;
  priority: number | null;
  deadline: string | null;
  list: string | null;
  createdAt: string;
  updatedAt: string;
  userPermissions: {
    userId: number;
    email: string;
    name: string;
    role: string;
  }[];
}

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editMode, setEditMode] = useState<'EXECUTOR' | 'STAKEHOLDER' | null>(null);

  if (!task) return null;

  const { user: loggedInUser } = useAuthStore();
  const isOwner = task.userPermissions.some(perm => perm.role === 'OWNER' && perm.userId === loggedInUser?.id);

  const getPriorityColor = (priority: number | null) => {
    if (priority === null) return 'bg-gray-200 text-gray-800';
    if (priority <= 1) return 'bg-red-100 text-red-800';
    if (priority <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handlePermissionsUpdate = () => {
    // Refetch task details or update local state
    console.log('Permissions updated');
    // You might want to trigger a re-fetch of the task data here
  };

  const openPermissionsModal = (mode: 'EXECUTOR' | 'STAKEHOLDER') => {
    setEditMode(mode);
    setShowPermissionsModal(true);
  };

  return (
    <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{task.project}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            {StatusText[task.status as keyof typeof StatusText] || task.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            Priority: {task.priority ?? '-'}
          </span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-700">{task.description || '-'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              Deadline: {formatDate(task.deadline)}
            </span>
          </div>
          <div className="flex items-center">
            <List className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              List: {task.list || '-'}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              Created: {formatDate(task.createdAt)}
            </span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">
              Updated: {formatDate(task.updatedAt)}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">Task Permissions</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-1">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                <span className="text-sm font-bold text-gray-700">
                  {task.userPermissions.find(user => user.role === 'OWNER')?.name || 'Not assigned'}
                </span>
              </div>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
            <div>
              <div className="flex items-center mb-1 justify-between">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-500" />
                  <span className="text-sm font-bold text-gray-700">
                    {task.userPermissions.find(user => user.role === 'EXECUTOR')?.name || 'Not assigned'}
                  </span>
                </div>
                {isOwner && (
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => openPermissionsModal('EXECUTOR')}
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">Assigned</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {task.userPermissions.length} stakeholder{task.userPermissions.length !== 1 ? 's' : ''}
            </span>
            {isOwner && (
              <button 
                className="text-gray-500 hover:text-gray-700 ml-2"
                onClick={() => openPermissionsModal('STAKEHOLDER')}
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      {showPermissionsModal && editMode && (
        <UserPermissionsModal
          taskId={task.id}
          role={editMode}
          onClose={() => {
            setShowPermissionsModal(false);
            setEditMode(null);
          }}
          onUpdate={handlePermissionsUpdate}
        />
      )}
    </div>
  );
};

export default TaskDetailsModal;
