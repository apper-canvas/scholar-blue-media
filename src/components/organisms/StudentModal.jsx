import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { studentsService } from "@/services/api/studentsService";

const StudentModal = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        grade: student.grade || '',
        dateOfBirth: student.dateOfBirth || '',
        email: student.email || '',
        phone: student.phone || '',
        address: student.address || '',
        status: student.status || 'active'
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        grade: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    } else {
      const gradeNum = parseInt(formData.grade);
      if (isNaN(gradeNum) || gradeNum < 9 || gradeNum > 12) {
        newErrors.grade = 'Grade must be between 9 and 12';
      }
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Check for duplicate email (simple validation)
    if (formData.email && !newErrors.email) {
      // This would typically be done server-side, but for demo purposes
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(formData.email)) {
        newErrors.email = 'Email format is invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      // Prepare data with proper type conversion
      const submitData = {
        ...formData,
        grade: parseInt(formData.grade),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase()
      };

let result;
      if (student) {
        result = await studentsService.update(student.Id, submitData);
      } else {
        result = await studentsService.create(submitData);
      }
      
      if (result) {
        toast.success(student ? 'Student updated successfully' : 'Student created successfully');
        
        // Safely call onSave if it's a function
        if (typeof onSave === 'function') {
          onSave();
        } else {
          console.warn('StudentModal: onSave prop is not a function');
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Student save error:', error);
      if (error.message && error.message.includes('validation')) {
        toast.error(`Validation error: ${error.message}`);
      } else if (error.message && error.message.includes('duplicate')) {
        toast.error('A student with this email already exists');
      } else {
        toast.error('Failed to save student record. Please check your data and try again.');
      }
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
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
<div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              error={errors.firstName}
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              error={errors.lastName}
            />
          </div>

<div className="grid grid-cols-2 gap-4">
            <FormField
              label="Grade"
              name="grade"
              type="number"
              value={formData.grade}
              onChange={handleChange}
              required
              min="9"
              max="12"
              error={errors.grade}
            />
            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              error={errors.dateOfBirth}
            />
          </div>

<FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <FormField
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />

          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
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
              {loading ? 'Saving...' : student ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;