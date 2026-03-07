import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { ServiceRequest } from '../types';
import { CameraIcon } from '../constants';

interface NewServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<ServiceRequest, 'id' | 'residentName' | 'floor' | 'status' | 'createdAt'>) => void;
}

const NewServiceRequestModal: React.FC<NewServiceRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [category, setCategory] = useState<'Electrical' | 'Plumbing' | 'Carpentry' | 'Other'>('Electrical');
  const [description, setDescription] = useState('');
  const [roomNumber, setRoomNumber] = useState('A-402'); // Mocked for now
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  useEffect(() => {
    // Reset form state when the modal opens to ensure a clean slate.
    if (isOpen) {
      setDescription('');
      setCategory('Electrical');
      setImageBase64(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
        alert('Please provide a description of the issue.');
        return;
    }
    onSubmit({ category, description, roomNumber, imageUrl: imageBase64 || undefined });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit a New Service Request">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="mt-1 block w-full px-3 py-2 bg-base-100 dark:bg-neutral-700 border border-base-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
          >
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>Carpentry</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="roomNumber" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Room Number</label>
          <input type="text" id="roomNumber" value={roomNumber} readOnly className="mt-1 block w-full px-3 py-2 bg-base-200 dark:bg-neutral-800 border border-base-300 dark:border-neutral-600 rounded-md shadow-sm cursor-not-allowed" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-base-300">Description of Issue</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-base-100 dark:bg-neutral-700 border border-base-300 dark:border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
            rows={3}
            required
            placeholder="e.g., The fan is not working and making a loud noise."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-base-300">Attach an Image (Optional)</label>
          <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-base-300 dark:border-neutral-600 border-dashed rounded-md">
            {imageBase64 ? (
              <div className="text-center relative">
                <img src={imageBase64} alt="Preview" className="mx-auto h-24 w-auto rounded-md"/>
                <button type="button" onClick={() => setImageBase64(null)} className="mt-2 text-sm text-red-600 hover:text-red-500">Remove Image</button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <CameraIcon />
                <div className="flex text-sm text-neutral-600 dark:text-base-300">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-base-100 dark:bg-neutral-700 rounded-md font-medium text-secondary hover:text-secondary-focus focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-secondary">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500 dark:text-base-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-base-200 dark:bg-neutral-600 text-neutral-800 dark:text-base-200 font-semibold rounded-lg hover:bg-base-300 dark:hover:bg-neutral-500">Cancel</motion.button>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="py-2 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-focus">Submit Request</motion.button>
        </div>
      </form>
    </Modal>
  );
};

export default NewServiceRequestModal;