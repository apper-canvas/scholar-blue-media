import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { gradesService } from '@/services/api/gradesService';
import { studentsService } from '@/services/api/studentsService';
import { assignmentsService } from '@/services/api/assignmentsService';
import Button from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import GradeModal from '@/components/organisms/GradeModal';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterGrades();
  }, [grades, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [gradesData, studentsData, assignmentsData] = await Promise.all([
        gradesService.getAll(),
        studentsService.getAll(),
        assignmentsService.getAll()
      ]);
      setGrades(gradesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError('Failed to load grades data');
    } finally {
      setLoading(false);
    }
  };

  const filterGrades = () => {
    if (!searchTerm) {
      setFilteredGrades(grades);
      return;
    }

    const filtered = grades.filter(grade => {
      const student = students.find(s => s.Id === parseInt(grade.studentId));
      const assignment = assignments.find(a => a.Id === parseInt(grade.assignmentId));
      
      return (
        (student && `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assignment && assignment.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        grade.score.toString().includes(searchTerm)
      );
    });
    setFilteredGrades(filtered);
  };

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradesService.delete(gradeId);
        toast.success('Grade deleted successfully');
        loadData();
      } catch (err) {
        toast.error('Failed to delete grade');
      }
    }
  };

  const handleModalSave = () => {
    loadData();
  };

  const getGradeBadgeColor = (score, totalPoints = 100) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'primary';
    if (percentage >= 70) return 'warning';
    if (percentage >= 60) return 'secondary';
    return 'error';
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId));
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getAssignmentName = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
    return assignment ? assignment.name : 'Unknown';
  };

  const getAssignmentPoints = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
    return assignment ? assignment.totalPoints : 100;
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600">Manage student grades and assessments</p>
        </div>
        <Button onClick={handleAddGrade} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Grade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Grade Book ({filteredGrades.length})</CardTitle>
            <SearchBar
              placeholder="Search grades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredGrades.length === 0 ? (
            <Empty
              title="No grades found"
              description="Get started by adding grades for your students."
              icon="ClipboardList"
              actionLabel="Add Grade"
              onAction={handleAddGrade}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Assignment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Percentage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade) => {
                    const totalPoints = getAssignmentPoints(grade.assignmentId);
                    const percentage = Math.round((grade.score / totalPoints) * 100);
                    
                    return (
                      <tr key={grade.Id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <ApperIcon name="User" className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {getStudentName(grade.studentId)}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {grade.studentId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {getAssignmentName(grade.assignmentId)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total: {totalPoints} points
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">
                            {grade.score}/{totalPoints}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getGradeBadgeColor(grade.score, totalPoints)}>
                            {percentage}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {grade.submittedDate}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditGrade(grade)}
                            >
                              <ApperIcon name="Edit" className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGrade(grade.Id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <ApperIcon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <GradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        grade={selectedGrade}
        onSave={handleModalSave}
        students={students}
        assignments={assignments}
      />
    </div>
  );
};

export default Grades;