import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { motion } from 'framer-motion';
import { CameraIcon, CheckCircleIcon } from '../constants';
import { ServiceRequest } from '../types';

interface CompleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ServiceRequest | null;
  onConfirm: (taskId: string, completionImageUrl: string) => void;
}

const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({ isOpen, onClose, task, onConfirm }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        setImageBase64(null);
        setError('');
    }
  }, [isOpen]);

  if (!task) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!imageBase64) {
      setError('Please upload an image to confirm completion.');
      return;
    }
    onConfirm(task.id, imageBase64);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Task Completion">
      <div className="space-y-4">
        <p className="text-sm text-neutral-600 dark:text-base-300">
          Upload a photo of the completed work to resolve the task. This will be visible to the resident.
        </p>
        <div className="p-3 bg-base-100 dark:bg-neutral-700/50 rounded-md border border-base-300 dark:border-neutral-600">
            <strong>{task.category}</strong> in <strong>Room {task.roomNumber}</strong>:
            <em className="block mt-1 text-sm text-neutral-500 dark:text-base-400">"{task.description}"</em>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-base-300">Completion Photo</label>
          <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-base-300 dark:border-neutral-600 border-dashed rounded-md">
            {imageBase64 ? (
              <div className="text-center relative">
                <img src={imageBase64} alt="Preview" className="mx-auto h-32 w-auto rounded-md"/>
                <button type="button" onClick={() => setImageBase64(null)} className="mt-2 text-sm text-red-600 hover:text-red-500">Remove Image</button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <CameraIcon />
                <div className="flex text-sm text-neutral-600 dark:text-base-300">
                  <label htmlFor="completion-file-upload" className="relative cursor-pointer bg-base-100 dark:bg-neutral-700 rounded-md font-medium text-secondary hover:text-secondary-focus focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary">
                    <span>Upload a file</span>
                    <input id="completion-file-upload" name="completion-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                </div>
                <p className="text-xs text-neutral-500 dark:text-base-400">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-4 pt-4">
          <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 font-semibold rounded-lg">Cancel</motion.button>
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            <CheckCircleIcon />
            Confirm & Complete
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteTaskModal;