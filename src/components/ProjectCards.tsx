import { useState, useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import TaskDetailsModal from './TaskDetailsModal';
import AddTask from './AddTask';
import { StatusText, getStatusColor } from '../utils/taskUtils';
import { Button } from "@/components/ui/button";

function ProjectCards() {
  const { projects, fetchProjects } = useTaskStore();
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toggleProjectExpansion = (projectName: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectName]: !prev[projectName]
    }));
  };

  const openTaskDetails = (task: any) => {
    setSelectedTask(task);
  };

  const handleAddTask = (projectName: string) => {
    setSelectedProject(projectName);
    setShowAddTask(true);
  };

  const handleTaskAdded = (newTask: { title: string; description: string; status: string }) => {
    console.log("New task added:", newTask);
    setShowAddTask(false);
    fetchProjects(); // Refresh the projects list
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.keys(projects).map((projectName) => (
          <div key={projectName} className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{projectName}</h3>
              <Button
                className="bg-black text-white rounded-full w-18 h-6 text-xs hover:bg-gray-800 transition-colors duration-200"
                onClick={() => handleAddTask(projectName)}
              >
                <Plus className="h-4 w-4 mr-1 inline" />
                task
              </Button>
            </div>
            <div 
              className="text-sm text-gray-600 cursor-pointer flex items-center"
              onClick={() => toggleProjectExpansion(projectName)}
            >
              <span>{projects[projectName].length} task{projects[projectName].length !== 1 ? 's' : ''}</span>
              {expandedProjects[projectName] ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
            </div>
            {expandedProjects[projectName] && (
              <ul className="mt-2 space-y-1">
                {projects[projectName].map((task) => (
                  <li 
                    key={task.id} 
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex justify-between items-center"
                    onClick={() => openTaskDetails(task)}
                  >
                    <span className="font-medium truncate mr-2">{task.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full w-24 text-center ${getStatusColor(task.status)}`}>
                      {StatusText[task.status as keyof typeof StatusText] || task.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {showAddTask && (
        <AddTask
          onClose={() => setShowAddTask(false)}
          onAddTask={(newTask) => handleTaskAdded(newTask)}
          project={selectedProject}
        />
      )}
    </>
  );
}

export default ProjectCards;
