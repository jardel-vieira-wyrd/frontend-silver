import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, List, AlertCircle, User, Edit } from 'lucide-react';
import { StatusText, getStatusColor } from '../utils/taskUtils';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import UserPermissionsModal from '../blocks/UserPermissionsModal';
import StatusSelectionModal from '../blocks/StatusSelectionModal';
import PrioritySelectionModal from '../blocks/PrioritySelectionModal';
import { TaskStatus } from '../api/api';

// Update the Task interface to include userPermissions
interface Task {
  id: number;
  title: string;
  project: string;
  description: string;
  status: TaskStatus;  // Use TaskStatus type here
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
  taskId: number;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ taskId, onClose }) => {
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [editMode, setEditMode] = useState<'EXECUTOR' | 'STAKEHOLDER' | null>(null);
  const { user: loggedInUser } = useAuthStore();
  const { projects } = useTaskStore();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    // Find the task in the projects
    for (const projectTasks of Object.values(projects)) {
      const foundTask = projectTasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        break;
      }
    }
  }, [taskId, projects]);

  const distinctUsersCount = useMemo(() => {
    if (!task) return 0;
    const userSet = new Set(
      task.userPermissions.map(perm => perm.userId)
    );
    return userSet.size;
  }, [task]);

  const isOwner = useMemo(() => {
    return task?.userPermissions.some(perm => perm.role === 'OWNER' && perm.userId === loggedInUser?.id) || false;
  }, [task, loggedInUser]);

  const isOwnerOrExecutor = useMemo(() => {
    return task?.userPermissions.some(perm => 
      (perm.role === 'OWNER' || perm.role === 'EXECUTOR') && perm.userId === loggedInUser?.id
    ) || false;
  }, [task, loggedInUser]);

  if (!task) return null;

  const getPriorityColor = (priority: number | null) => {
    const effectivePriority = priority === null ? 0 : priority;
    if (effectivePriority === 0) return 'bg-white text-gray-800';
    if (effectivePriority <= 1) return 'bg-red-100 text-red-800';
    if (effectivePriority <= 3) return 'bg-red-300 text-red-800';
    return 'bg-red-500 text-white';
  };

  const getPriorityText = (priority: number | null) => {
    return priority === null ? '0' : priority.toString();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handlePermissionsUpdate = () => {
    setEditMode(null);
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
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)} w-24 text-center`}>
              {StatusText[task.status] || task.status}
            </span>
            {isOwnerOrExecutor && (
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowStatusModal(true)}
              >
                <Edit size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)} w-24 text-center font-bold`}>
              Priority: {getPriorityText(task.priority)}
            </span>
            {isOwnerOrExecutor && (
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPriorityModal(true)}
              >
                <Edit size={16} />
              </button>
            )}
          </div>
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

            <div className="flex w-full justify-between items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1.5 rounded">
                {distinctUsersCount} person{distinctUsersCount !== 1 ? 's' : ''}
                </span>
                {isOwner && (
                <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => openPermissionsModal('STAKEHOLDER')}
                >
                    <Edit size={16} />
                </button>
                )}
            </div>
            
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

        </div>
      </div>
      {showPermissionsModal && editMode && (
        <UserPermissionsModal
          taskId={task.id}
          role={editMode}
          onClose={() => {
            setEditMode(null);
          }}
          onUpdate={handlePermissionsUpdate}
        />
      )}
      {showStatusModal && task && (
        <StatusSelectionModal
          taskId={task.id}
          currentStatus={task.status}
          onClose={() => setShowStatusModal(false)}
        />
      )}
      {showPriorityModal && task && (
        <PrioritySelectionModal
          taskId={task.id}
          currentPriority={task.priority}
          onClose={() => setShowPriorityModal(false)}
        />
      )}
    </div>
  );
};

export default TaskDetailsModal;
