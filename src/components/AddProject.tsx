import { useState } from "react";
import { useTaskStore } from "../stores/taskStore";
import { Plus } from "lucide-react";
import { Button } from "@/assets/ui/button";
import AddTask from "../blocks/AddTask";

function AddProject() {
  const [showAddTask, setShowAddTask] = useState(false);
  const groupBy = useTaskStore((state) => state.groupBy);

  const handleAddTask = () => {
    setShowAddTask(true);
  };

  return (
    <>
      {showAddTask && (
        <AddTask
          onClose={() => setShowAddTask(false)}
          onAddTask={(task) => {
            console.log("Task to be added:", task);
            setShowAddTask(false);
          }}
          project={""}
        />
      )}
      {groupBy === 'project' && (
        <Button
          className="self-end mt-4 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-colors duration-200"
          onClick={handleAddTask}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Task to a New Project
        </Button>
      )}
    </>
  );
}

export default AddProject;
