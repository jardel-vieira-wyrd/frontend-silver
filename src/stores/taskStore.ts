import { create } from 'zustand';
import { tasks } from '../api/api';

interface UserPermission {
  userId: number;
  email: string;
  name: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  project: string;
  description: string;
  status: 'TO_DO' | 'DOING' | 'DONE' | 'CANCELED';
  priority: number | null;
  deadline: string | null;
  list: string | null;
  createdAt: string;
  updatedAt: string;
  userPermissions: UserPermission[];
}

interface ProjectTasks {
  [projectName: string]: Task[];
}

interface TaskState {
  projects: ProjectTasks;
  fetchProjects: () => Promise<void>;
  addTask: (task: Task) => void;
  updateStore: () => Promise<void>;
  updateTaskPermission: (taskId: number, userId: number, role: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  projects: {},
  fetchProjects: async () => {
    try {
      const projects = await tasks.getProjects();
      set({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  },
  addTask: (task: Task) => {
    set((state) => {
      const updatedProjects = { ...state.projects };
      if (!updatedProjects[task.project]) {
        updatedProjects[task.project] = [];
      }
      updatedProjects[task.project].push(task);
      return { projects: updatedProjects };
    });
  },
  updateStore: async () => {
    await get().fetchProjects();
  },
  updateTaskPermission: (taskId: number, userId: number, role: string) => {
    set((state) => {
      const updatedProjects = { ...state.projects };
      for (const projectName in updatedProjects) {
        updatedProjects[projectName] = updatedProjects[projectName].map(task => {
          if (task.id === taskId) {
            const updatedPermissions = task.userPermissions.map(perm => 
              perm.userId === userId ? { ...perm, role } : perm
            );
            if (!updatedPermissions.some(perm => perm.userId === userId)) {
              // If the user doesn't exist in the permissions, add them
              updatedPermissions.push({ userId, role, name: '', email: '' });
            }
            return { ...task, userPermissions: updatedPermissions };
          }
          return task;
        });
      }
      return { projects: updatedProjects };
    });
  },
}));
