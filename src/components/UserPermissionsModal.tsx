import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { X, Check, AlertCircle } from 'lucide-react';
import { tasks } from '../api/api';

interface UserPermissionsModalProps {
  taskId: number;
  role: 'EXECUTOR' | 'STAKEHOLDER';
  onClose: () => void;
  onUpdate: () => void;
}

const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  taskId,
  role,
  onClose,
  onUpdate
}) => {
  const { registeredUsers, fetchRegisteredUsers } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegisteredUsers();
  }, [fetchRegisteredUsers]);

  const handleSubmit = async () => {
    if (selectedUserId === null) return;

    setIsLoading(true);
    setError(null);

    try {
      await tasks.updatePermission(taskId, selectedUserId, role);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update permission:', error);
      setError('Failed to update permission. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 p-4 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {role === 'EXECUTOR' ? 'Assign Executor' : 'Add Stakeholder'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4 h-[70vh] flex-grow overflow-y-auto">
          <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select User
          </label>
          <select
            id="user-select"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            className="w-full h-full border rounded px-3 py-2"
            size={5}
          >
            {/* <option value="">Select a user</option> */}
            {registeredUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        {error && (
          <div className="mb-4 text-red-500 flex items-center">
            <AlertCircle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={selectedUserId === null || isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Check size={16} className="inline mr-2" />
                Assign Role
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsModal;
