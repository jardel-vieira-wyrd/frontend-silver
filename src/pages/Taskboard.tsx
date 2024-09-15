import { useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddTask from "../components/AddTask"; // Import the AddTask component
import ProjectCards from "@/components/ProjectCards";

function Taskboard() {
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = () => {
    setShowAddTask(true);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-16rem)] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <div className="flex-grow overflow-auto">
          <ProjectCards />
        </div>
        {showAddTask && <AddTask onClose={() => setShowAddTask(false)} onAddTask={(task) => {
          console.log("Task to be added:", task);
          setShowAddTask(false);
        } } project={""} />}
        <Button
          className="self-end mt-4 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors duration-200"
          onClick={handleAddTask}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Task to a New Project
        </Button>
      </div>
    </Layout>
  );
}

export default Taskboard;
