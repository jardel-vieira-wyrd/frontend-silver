import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTask } from "../api/api"; 

interface AddTaskProps {
  onClose: () => void;
  onAddTask: (task: any) => void;
}

function AddTask({ onClose, onAddTask }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TO_DO");
  const [priority, setPriority] = useState<number | undefined>(undefined);
  const [deadline, setDeadline] = useState("");
  const [list, setList] = useState("");
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
        status: status as 'TO_DO' | 'DOING' | 'DONE' | 'CANCELED',
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        list,
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
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
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
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TO_DO">To Do</SelectItem>
                <SelectItem value="DOING">Doing</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              value={priority?.toString() || ""}
              onChange={(e) => setPriority(parseInt(e.target.value) || undefined)}
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
          <div>
            <Label htmlFor="list">List</Label>
            <Input
              id="list"
              value={list}
              onChange={(e) => setList(e.target.value)}
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
