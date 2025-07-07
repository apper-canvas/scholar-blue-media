import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { classesService } from '@/services/api/classesService';
import Button from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ClassModal from '@/components/organisms/ClassModal';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await classesService.getAll();
      setClasses(data);
    } catch (err) {
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    if (!searchTerm) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter(classItem =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.room.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await classesService.delete(classId);
        toast.success('Class deleted successfully');
        loadClasses();
      } catch (err) {
        toast.error('Failed to delete class');
      }
    }
  };

  const handleModalSave = () => {
    loadClasses();
  };

  const getSubjectBadgeColor = (subject) => {
    switch (subject) {
      case 'Mathematics': return 'primary';
      case 'English': return 'success';
      case 'Science': return 'info';
      case 'History': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClasses} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage classes and course information</p>
        </div>
        <Button onClick={handleAddClass} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Class
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Class List ({filteredClasses.length})</CardTitle>
            <SearchBar
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredClasses.length === 0 ? (
            <Empty
              title="No classes found"
              description="Get started by adding your first class to the system."
              icon="BookOpen"
              actionLabel="Add Class"
              onAction={handleAddClass}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Class Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Period</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Semester</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((classItem) => (
                    <tr key={classItem.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="BookOpen" className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{classItem.name}</p>
                            <p className="text-sm text-gray-500">ID: {classItem.Id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getSubjectBadgeColor(classItem.subject)}>
                          {classItem.subject}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">Period {classItem.period}</td>
                      <td className="py-3 px-4 text-gray-600">Room {classItem.room}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">
                          {classItem.semester} {classItem.year}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClass(classItem)}
                          >
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClass(classItem.Id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classItem={selectedClass}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Classes;