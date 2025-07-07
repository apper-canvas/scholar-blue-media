import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { gradesService } from '@/services/api/gradesService';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';

const GradeModal = ({ isOpen, onClose, grade, onSave, students, assignments }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentId: '',
    score: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);

  const studentOptions = [
    { value: '', label: 'Select Student' },
    ...(students || []).map(student => ({
      value: student.Id.toString(),
      label: `${student.firstName} ${student.lastName}`
    }))
  ];

  const assignmentOptions = [
    { value: '', label: 'Select Assignment' },
    ...(assignments || []).map(assignment => ({
      value: assignment.Id.toString(),
      label: `${assignment.name} (${assignment.totalPoints} pts)`
    }))
  ];

  useEffect(() => {
    if (grade) {
      setFormData({
        studentId: grade.studentId || '',
        assignmentId: grade.assignmentId || '',
        score: grade.score || '',
        comments: grade.comments || ''
      });
    } else {
      setFormData({
        studentId: '',
        assignmentId: '',
        score: '',
        comments: ''
      });
    }
  }, [grade]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (grade) {
        result = await gradesService.update(grade.Id, formData);
      } else {
        result = await gradesService.create(formData);
      }

      if (result) {
        toast.success(grade ? 'Grade updated successfully' : 'Grade created successfully');
        onSave();
        onClose();
      }
    } catch (error) {
      toast.error('Failed to save grade');
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
            {grade ? 'Edit Grade' : 'Add New Grade'}
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
            label="Student"
            name="studentId"
            type="select"
            value={formData.studentId}
            onChange={handleChange}
            options={studentOptions}
            required
          />

          <FormField
            label="Assignment"
            name="assignmentId"
            type="select"
            value={formData.assignmentId}
            onChange={handleChange}
            options={assignmentOptions}
            required
          />

          <FormField
            label="Score"
            name="score"
            type="number"
            value={formData.score}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
          />

          <FormField
            label="Comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Optional feedback..."
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
              {loading ? 'Saving...' : grade ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;