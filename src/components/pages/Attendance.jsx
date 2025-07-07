import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { attendanceService } from '@/services/api/attendanceService';
import { studentsService } from '@/services/api/studentsService';
import { classesService } from '@/services/api/classesService';
import Button from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [attendanceData, studentsData, classesData] = await Promise.all([
        attendanceService.getAll(),
        studentsService.getAll(),
        classesService.getAll()
      ]);
      setAttendance(attendanceData);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const existingRecord = attendance.find(
        a => a.studentId === studentId.toString() && 
            a.date === selectedDate && 
            a.classId === selectedClass
      );

      if (existingRecord) {
        await attendanceService.update(existingRecord.Id, { status: newStatus });
      } else {
        await attendanceService.create({
          studentId: studentId.toString(),
          classId: selectedClass,
          date: selectedDate,
          status: newStatus,
          reason: ''
        });
      }

      toast.success('Attendance updated successfully');
      loadData();
    } catch (err) {
      toast.error('Failed to update attendance');
    }
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(
      a => a.studentId === studentId.toString() && 
          a.date === selectedDate && 
          a.classId === selectedClass
    );
    return record ? record.status : 'not_marked';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'tardy': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return 'CheckCircle';
      case 'absent': return 'XCircle';
      case 'tardy': return 'Clock';
      default: return 'Circle';
    }
  };

  const filteredStudents = students.filter(student => {
    // For demo purposes, showing all students
    // In a real app, you'd filter by class enrollment
    return true;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track student attendance and participation</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Tracking</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select a class</option>
                {classes.map(classItem => (
                  <option key={classItem.Id} value={classItem.Id.toString()}>
                    {classItem.name} - Period {classItem.period}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedClass ? (
            <Empty
              title="Select a class to view attendance"
              description="Choose a class from the dropdown above to start tracking attendance."
              icon="Calendar"
            />
          ) : filteredStudents.length === 0 ? (
            <Empty
              title="No students found"
              description="There are no students enrolled in this class."
              icon="Users"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const status = getAttendanceStatus(student.Id);
                    
                    return (
                      <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {student.firstName[0]}{student.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                Grade {student.grade}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <ApperIcon 
                              name={getStatusIcon(status)} 
                              className={`h-5 w-5 ${
                                status === 'present' ? 'text-green-500' :
                                status === 'absent' ? 'text-red-500' :
                                status === 'tardy' ? 'text-yellow-500' :
                                'text-gray-400'
                              }`}
                            />
                            <Badge variant={getStatusBadgeColor(status)}>
                              {status === 'not_marked' ? 'Not Marked' : 
                               status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant={status === 'present' ? 'success' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange(student.Id, 'present')}
                            >
                              <ApperIcon name="Check" className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={status === 'absent' ? 'danger' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange(student.Id, 'absent')}
                            >
                              <ApperIcon name="X" className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={status === 'tardy' ? 'secondary' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange(student.Id, 'tardy')}
                            >
                              <ApperIcon name="Clock" className="h-4 w-4" />
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

      {/* Attendance Summary */}
      {selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">
                    {attendance.filter(a => a.date === selectedDate && a.classId === selectedClass && a.status === 'present').length}
                  </p>
                </div>
                <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {attendance.filter(a => a.date === selectedDate && a.classId === selectedClass && a.status === 'absent').length}
                  </p>
                </div>
                <ApperIcon name="XCircle" className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tardy</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {attendance.filter(a => a.date === selectedDate && a.classId === selectedClass && a.status === 'tardy').length}
                  </p>
                </div>
                <ApperIcon name="Clock" className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredStudents.length}
                  </p>
                </div>
                <ApperIcon name="Users" className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Attendance;