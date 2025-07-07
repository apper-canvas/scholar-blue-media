import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { classesService } from '@/services/api/classesService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const ClassModal = ({ isOpen, onClose, classItem, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    period: '',
    room: '',
    semester: '',
    teacherId: ''
  });
  const [loading, setLoading] = useState(false);

  const subjectOptions = [
    { value: '', label: 'Select Subject' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English', label: 'English' },
    { value: 'Science', label: 'Science' },
    { value: 'History', label: 'History' },
    { value: 'Foreign Language', label: 'Foreign Language' },
    { value: 'Physical Education', label: 'Physical Education' },
    { value: 'Arts', label: 'Arts' }
  ];

  const semesterOptions = [
    { value: '', label: 'Select Semester' },
    { value: 'Fall', label: 'Fall' },
    { value: 'Spring', label: 'Spring' },
    { value: 'Summer', label: 'Summer' }
  ];

  useEffect(() => {
    if (classItem) {
      setFormData({
        name: classItem.name || '',
        subject: classItem.subject || '',
        period: classItem.period || '',
        room: classItem.room || '',
        semester: classItem.semester || '',
        teacherId: classItem.teacherId || ''
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        period: '',
        room: '',
        semester: '',
        teacherId: ''
      });
    }
  }, [classItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (classItem) {
        result = await classesService.update(classItem.Id, formData);
      } else {
        result = await classesService.create(formData);
      }

      if (result) {
        toast.success(classItem ? 'Class updated successfully' : 'Class created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      toast.error('Failed to save class');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {classItem ? 'Edit Class' : 'Add New Class'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Algebra II"
          />

          <FormField
            label="Subject"
            name="subject"
            type="select"
            value={formData.subject}
            onChange={handleChange}
            options={subjectOptions}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Period"
              name="period"
              type="number"
              value={formData.period}
              onChange={handleChange}
              required
              min="1"
              max="8"
            />
            <FormField
              label="Room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
              placeholder="e.g., 101"
            />
          </div>

          <FormField
            label="Semester"
            name="semester"
            type="select"
            value={formData.semester}
            onChange={handleChange}
            options={semesterOptions}
            required
          />

          <FormField
            label="Teacher ID"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            placeholder="e.g., teacher1"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : classItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassModal;