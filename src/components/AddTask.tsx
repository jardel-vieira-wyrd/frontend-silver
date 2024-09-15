import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "../api/api";
import { useTaskStore } from '../stores/taskStore';

interface AddTaskProps {
  onClose: () => void;
  onAddTask: (newTask: { title: string; description: string; status: string }) => void;
  project: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
  rows?: number;
}

function AddTask({ onClose, project }: AddTaskProps) {
  const updateStore = useTaskStore((state) => state.updateStore);
  const [currentProject, setCurrentProject] = useState(project || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const newTask = {
        title,
        project: currentProject,
        description,
        status: 'TO_DO' as const,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      };

      const createdTask = await createTask(newTask);
      await updateStore(); // Update the store after creating the task
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
    if (currentProject.length < 1) {
      setError("Project is required");
      return false;
    }
    if (title.length < 3) {
      setError("Task Title must be at least 3 characters long");
      return false;
    }
    return true;
  };

  const formFields: FormField[] = [
    {
      id: "project",
      label: "Project *",
      type: "text",
      value: currentProject,
      onChange: setCurrentProject,
      required: true,
      disabled: !!project
    },
    {
      id: "title",
      label: "Task Title *",
      type: "text",
      value: title,
      onChange: setTitle,
      required: true,
      minLength: 3
    },
    {
      id: "description",
      label: "Description",
      type: "textarea",
      value: description,
      onChange: setDescription,
      rows: 3
    },
    {
      id: "deadline",
      label: "Deadline",
      type: "datetime-local",
      value: deadline,
      onChange: setDeadline
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={field.rows}
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required={field.required}
                  minLength={field.minLength}
                  disabled={field.disabled}
                />
              )}
            </div>
          ))}
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
