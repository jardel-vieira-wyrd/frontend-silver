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
}));
