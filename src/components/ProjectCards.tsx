import { useState, useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import TaskDetailsModal from './TaskDetailsModal';
import AddTask from '../blocks/AddTask';
import { StatusText, getStatusColor, getPriorityColor } from '../utils/taskUtils';
import { Button } from "@/assets/ui/button";

function ProjectCards() {
  const { projects, fetchProjects, groupBy, setGroupBy } = useTaskStore();
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    if (!groupBy) setGroupBy('project');
    fetchProjects();
  }, [fetchProjects]);

  const toggleProjectExpansion = (projectName: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectName]: !prev[projectName]
    }));
  };

  const openTaskDetails = (taskId: number) => {
    setSelectedTaskId(taskId);
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

  const title = groupBy === 'user' ? 'Team' : 'Projects';
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(projects).map((projectName) => (
          <div key={projectName} className="bg-white border-2 border-gray-300 rounded-lg p-6 relative min-h-[130px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{projectName}</h3>
              <div 
                className="text-sm text-gray-600 cursor-pointer flex items-center"
                onClick={() => toggleProjectExpansion(projectName)}
              >
                <span>{projects[projectName].length} task{projects[projectName].length !== 1 ? 's' : ''}</span>
                {expandedProjects[projectName] ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-4">
              {/* High Priority Task Box */}
              {projects[projectName].length > 0 && (
                <div className="w-[60%] p-3 bg-gray-100 rounded-md flex flex-col">
                  <p className="text-xs font-semibold text-gray-500 mb-1">High Priority Task</p>
                  <div 
                    className="text-sm cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between items-center"
                    onClick={() => openTaskDetails(projects[projectName][0].id)}
                  >
                    <span className="font-medium truncate mr-2">{projects[projectName][0].title}</span>               
                  </div>
                </div>
              )}
              
              {/* Add Task Button */}
              {groupBy === 'project' && (
                <Button
                  className="bg-black text-white rounded-full w-28 h-10 text-xs hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
                  onClick={() => handleAddTask(projectName)}
                >
                  <Plus className="h-6 w-6 mr-2" /> Add Task
                </Button>
              )}
            </div>

            {expandedProjects[projectName] && (
              <ul className="mt-2 space-y-2 flex-grow">
                {projects[projectName].map((task) => (
                  <li 
                    key={task.id} 
                    className="text-sm cursor-pointer hover:bg-gray-100 p-2 rounded flex justify-between items-center border border-gray-200 shadow-sm"
                    onClick={() => openTaskDetails(task.id)}
                  >
                    <span className="font-medium truncate mr-2">{task.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full w-24 text-center ${getStatusColor(task.status)}`}>
                        {StatusText[task.status as keyof typeof StatusText] || task.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full w-16 text-center ${getPriorityColor(task.priority)}`}>
                        {task.priority === null ? 'P0' : `P${task.priority}`}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {selectedTaskId && (
        <TaskDetailsModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
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
