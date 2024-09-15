import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "../api/api"; 

interface AddTaskProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
}

function AddTask({ onClose, onAddTask }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const newTask = {
        title,
        project,
        description,
        status: 'TO_DO' as const,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      };

      const createdTask = await createTask(newTask);
      onAddTask(createdTask);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to add task");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const validateForm = (): boolean => {
    if (title.length < 3) {
      setError("Title must be at least 3 characters long");
      return false;
    }
    if (project.length < 1) {
      setError("Project is required");
      return false;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div>
            <Label htmlFor="project">Project *</Label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTask;
