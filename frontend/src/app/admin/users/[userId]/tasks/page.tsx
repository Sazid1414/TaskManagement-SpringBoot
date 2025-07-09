'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Task } from '@/types';
import { taskService } from '@/services/task.service';
import { formatDate, getStatusColor } from '@/utils/helpers';
import { isAdmin } from '@/utils/auth';
import TaskDetail from '@/components/TaskDetail';

interface PageProps {
  params: {
    userId: string;
  };
}

export default function UserTasksPage({ params }: PageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams?.get('username') || '';
  const userId = parseInt(params.userId, 10);

  useEffect(() => {
    const checkAdminAndFetchTasks = async () => {
      if (!isAdmin()) {
        router.push('/dashboard');
        return;
      }

      try {
        setLoading(true);
        // Assuming backend has an endpoint to get tasks by user ID for admin
        const fetchedTasks = await taskService.getTasksByUser(userId);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchTasks();
  }, [router, userId]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Admin
          </button>
          <h1 className="text-2xl font-bold mt-2">Tasks for {username}</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">User Tasks</h2>
          <p className="text-sm text-gray-600">Total tasks: {tasks.length}</p>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">{task.description}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {task.dueDate && <p>Due: {formatDate(task.dueDate)}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No tasks found for this user
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={handleTaskDelete}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}
