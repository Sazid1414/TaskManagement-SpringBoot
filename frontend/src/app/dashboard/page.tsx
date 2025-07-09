'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/task.service';
import { Task } from '@/types';
import { formatDate, getStatusColor } from '@/utils/helpers';
import { requireAuth } from '@/utils/auth';
import TaskForm from '@/components/TaskForm';
import TaskDetail from '@/components/TaskDetail';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!requireAuth(router)) {
      return;
    }
    
    // Fetch tasks
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };
  
  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(null);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  /* This function is now handled in the TaskDetail component */

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setSelectedTask(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleFormSubmit = async (formData: Partial<Task>) => {
    try {
      if (isEditMode && selectedTask) {
        // Update existing task
        const updated = await taskService.updateTask(selectedTask.id, formData);
        setTasks(tasks.map(task => task.id === updated.id ? updated : task));
      } else {
        // Create new task
        const newTask = await taskService.createTask(formData);
        setTasks([...tasks, newTask]);
      }
      setIsFormOpen(false);
      setSelectedTask(null);
      setIsEditMode(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save task');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
  };

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error message */}
          {error && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
            <button
              onClick={handleCreateTask}
              className="btn btn-primary flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Task
            </button>
          </div>

          {/* Task Form Modal */}
          {isFormOpen && (
            <TaskForm
              isOpen={isFormOpen}
              onClose={handleFormCancel}
              onSubmit={handleFormSubmit}
              initialData={isEditMode ? selectedTask : null}
              isEdit={isEditMode}
            />
          )}

          {/* Task Detail Modal */}
          {selectedTask && !isFormOpen && (
            <TaskDetail
              task={selectedTask}
              isOpen={!!selectedTask && !isFormOpen}
              onClose={handleCloseDetail}
              onDelete={handleDeleteTask}
              onUpdate={handleTaskUpdate}
            />
          )}

          {/* Task List */}
          <div className="mt-6">
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No tasks found. Create your first task!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                      {task.dueDate && (
                        <div className="mt-4 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formatDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
