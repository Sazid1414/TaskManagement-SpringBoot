import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Task } from '@/types';
import { formatDate, getStatusColor } from '@/utils/helpers';
import { taskService } from '@/services/task.service';
import TaskForm from './TaskForm';

interface TaskDetailProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (task: Task) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onDelete,
  onUpdate
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await taskService.deleteTask(task.id);
      onDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleUpdate = (updatedTask: Task) => {
    onUpdate(updatedTask);
    setShowEditForm(false);
  };

  // If edit form is shown, render TaskForm instead
  if (showEditForm) {
    return (
      <TaskForm
        isOpen={true}
        onClose={() => setShowEditForm(false)}
        onSubmit={(updatedData) => handleUpdate({...task, ...updatedData as Task})}
        initialData={task}
        isEdit={true}
      />
    );
  }

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-10 overflow-y-auto" 
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Task Details
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="mt-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-lg">{task.title}</h4>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="mt-1">{task.description}</p>
                </div>
                
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="mt-1">{task.createdAt ? formatDate(task.createdAt) : 'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="mt-1">{task.dueDate ? formatDate(task.dueDate) : 'Not set'}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskDetail;
