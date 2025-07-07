import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { studentsService } from '@/services/api/studentsService';
import { classesService } from '@/services/api/classesService';
import { gradesService } from '@/services/api/gradesService';
import { attendanceService } from '@/services/api/attendanceService';
import Button from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [studentsData, classesData, gradesData, attendanceData] = await Promise.all([
        studentsService.getAll(),
        classesService.getAll(),
        gradesService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentsData);
      setClasses(classesData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (!selectedReport) {
      toast.error('Please select a report type');
      return;
    }

    let reportData = '';
    let filename = '';

    switch (selectedReport) {
      case 'student_grades':
        if (!selectedStudent) {
          toast.error('Please select a student');
          return;
        }
        reportData = generateStudentGradesReport();
        filename = `student_grades_${selectedStudent}.csv`;
        break;
      case 'class_roster':
        if (!selectedClass) {
          toast.error('Please select a class');
          return;
        }
        reportData = generateClassRosterReport();
        filename = `class_roster_${selectedClass}.csv`;
        break;
      case 'attendance_summary':
        if (!selectedClass) {
          toast.error('Please select a class');
          return;
        }
        reportData = generateAttendanceSummaryReport();
        filename = `attendance_summary_${selectedClass}.csv`;
        break;
      case 'grade_book':
        if (!selectedClass) {
          toast.error('Please select a class');
          return;
        }
        reportData = generateGradeBookReport();
        filename = `grade_book_${selectedClass}.csv`;
        break;
      default:
        toast.error('Invalid report type');
        return;
    }

    downloadCSV(reportData, filename);
    toast.success('Report generated successfully');
  };

  const generateStudentGradesReport = () => {
    const student = students.find(s => s.Id === parseInt(selectedStudent));
    const studentGrades = grades.filter(g => g.studentId === selectedStudent);
    
    let csv = 'Student Name,Assignment,Score,Total Points,Percentage,Date\n';
    
    studentGrades.forEach(grade => {
      const percentage = Math.round((grade.score / 100) * 100); // Assuming 100 points for demo
      csv += `"${student.firstName} ${student.lastName}","Assignment ${grade.assignmentId}",${grade.score},100,${percentage}%,${grade.submittedDate}\n`;
    });
    
    return csv;
  };

  const generateClassRosterReport = () => {
    const classInfo = classes.find(c => c.Id === parseInt(selectedClass));
    
    let csv = 'Class Name,Student Name,Grade,Email,Phone,Enrollment Date\n';
    
    students.forEach(student => {
      csv += `"${classInfo.name}","${student.firstName} ${student.lastName}",${student.grade},"${student.email}","${student.phone}","${student.enrollmentDate}"\n`;
    });
    
    return csv;
  };

  const generateAttendanceSummaryReport = () => {
    const classInfo = classes.find(c => c.Id === parseInt(selectedClass));
    const classAttendance = attendance.filter(a => a.classId === selectedClass);
    
    let csv = 'Class Name,Student Name,Date,Status,Reason\n';
    
    classAttendance.forEach(record => {
      const student = students.find(s => s.Id === parseInt(record.studentId));
      csv += `"${classInfo.name}","${student.firstName} ${student.lastName}","${record.date}","${record.status}","${record.reason}"\n`;
    });
    
    return csv;
  };

  const generateGradeBookReport = () => {
    const classInfo = classes.find(c => c.Id === parseInt(selectedClass));
    
    let csv = 'Class Name,Student Name,Assignment,Score,Total Points,Percentage\n';
    
    grades.forEach(grade => {
      const student = students.find(s => s.Id === parseInt(grade.studentId));
      const percentage = Math.round((grade.score / 100) * 100); // Assuming 100 points for demo
      csv += `"${classInfo.name}","${student.firstName} ${student.lastName}","Assignment ${grade.assignmentId}",${grade.score},100,${percentage}%\n`;
    });
    
    return csv;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportTypes = [
    { value: '', label: 'Select Report Type' },
    { value: 'student_grades', label: 'Student Grades Report' },
    { value: 'class_roster', label: 'Class Roster Report' },
    { value: 'attendance_summary', label: 'Attendance Summary Report' },
    { value: 'grade_book', label: 'Grade Book Report' }
  ];

  const studentOptions = [
    { value: '', label: 'Select Student' },
    ...students.map(student => ({
      value: student.Id.toString(),
      label: `${student.firstName} ${student.lastName}`
    }))
  ];

  const classOptions = [
    { value: '', label: 'Select Class' },
    ...classes.map(classItem => ({
      value: classItem.Id.toString(),
      label: `${classItem.name} - Period ${classItem.period}`
    }))
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export academic reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <Select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            {(selectedReport === 'class_roster' || selectedReport === 'attendance_summary' || selectedReport === 'grade_book') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {selectedReport === 'student_grades' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <Select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {studentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <Button 
              onClick={generateReport}
              className="w-full flex items-center justify-center gap-2"
            >
              <ApperIcon name="Download" className="h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Report Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Report Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Users" className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Total Students</span>
                </div>
                <span className="text-blue-600 font-bold">{students.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="BookOpen" className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Total Classes</span>
                </div>
                <span className="text-green-600 font-bold">{classes.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="ClipboardList" className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-gray-900">Total Grades</span>
                </div>
                <span className="text-amber-600 font-bold">{grades.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Calendar" className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Attendance Records</span>
                </div>
                <span className="text-purple-600 font-bold">{attendance.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <ApperIcon name="User" className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-gray-900">Student Grades Report</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Individual student performance across all assignments and assessments.
              </p>
              <div className="text-xs text-gray-500">
                Includes: Student name, assignment details, scores, percentages, submission dates
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <ApperIcon name="Users" className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Class Roster Report</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Complete list of students enrolled in a specific class.
              </p>
              <div className="text-xs text-gray-500">
                Includes: Student names, grades, contact information, enrollment dates
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <ApperIcon name="Calendar" className="h-5 w-5 text-amber-600" />
                <h3 className="font-medium text-gray-900">Attendance Summary Report</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Comprehensive attendance tracking for a specific class.
              </p>
              <div className="text-xs text-gray-500">
                Includes: Student names, dates, attendance status, absence reasons
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <ApperIcon name="ClipboardList" className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Grade Book Report</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Complete grade book with all student scores for a class.
              </p>
              <div className="text-xs text-gray-500">
                Includes: All students, all assignments, scores, percentages, class averages
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;