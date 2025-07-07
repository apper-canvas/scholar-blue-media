import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import StudentModal from "@/components/organisms/StudentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";
import Reports from "@/components/pages/Reports";
import StatCard from "@/components/molecules/StatCard";
import assignmentsData from "@/services/mockData/assignments.json";
import attendanceData from "@/services/mockData/attendance.json";
import gradesData from "@/services/mockData/grades.json";
import classesData from "@/services/mockData/classes.json";
import studentsData from "@/services/mockData/students.json";
import { attendanceService } from "@/services/api/attendanceService";
import { gradesService } from "@/services/api/gradesService";
import { classesService } from "@/services/api/classesService";
import { studentsService } from "@/services/api/studentsService";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [students, classes, grades, attendance] = await Promise.all([
        studentsService.getAll(),
        classesService.getAll(),
        gradesService.getAll(),
        attendanceService.getAll()
      ]);

      // Calculate stats
      const totalStudents = students.length;
      const totalClasses = classes.length;
      const averageGrade = grades.length > 0 
        ? Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length)
        : 0;
      
      const presentCount = attendance.filter(a => a.status === 'present').length;
      const attendanceRate = attendance.length > 0 
        ? Math.round((presentCount / attendance.length) * 100)
        : 0;

      setStats({
        totalStudents,
        totalClasses,
        averageGrade,
        attendanceRate
      });

      // Generate recent activity
      const activity = [
        { id: 1, type: 'grade', message: 'New grades entered for Algebra II', time: '2 hours ago' },
        { id: 2, type: 'attendance', message: 'Attendance marked for Chemistry', time: '4 hours ago' },
        { id: 3, type: 'student', message: 'New student enrolled: Sarah Williams', time: '1 day ago' },
        { id: 4, type: 'assignment', message: 'New assignment created: Essay Analysis', time: '2 days ago' }
      ];

      setRecentActivity(activity);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
};

  const handleAddStudent = () => {
    setIsStudentModalOpen(true);
  };

  const handleStudentModalClose = () => {
    setIsStudentModalOpen(false);
  };

  const handleStudentCreated = () => {
    setIsStudentModalOpen(false);
    loadDashboardData(); // Refresh dashboard data
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

return (
    <>
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="blue"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="BookOpen"
          color="green"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="TrendingUp"
          color="amber"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon 
                      name={
                        activity.type === 'grade' ? 'ClipboardList' :
                        activity.type === 'attendance' ? 'Calendar' :
                        activity.type === 'student' ? 'Users' : 'FileText'
                      }
                      className="h-4 w-4 text-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
<div className="space-y-3">
              <button 
                onClick={handleAddStudent}
                className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ApperIcon name="UserPlus" className="h-5 w-5 text-primary" />
                  <span className="font-medium">Add New Student</span>
                </div>
              </button>
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ApperIcon name="CalendarCheck" className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Mark Attendance</span>
                </div>
              </button>
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ApperIcon name="ClipboardList" className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Enter Grades</span>
                </div>
              </button>
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ApperIcon name="FileText" className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Generate Report</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Clock" className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Chemistry Lab Reports Due</p>
                  <p className="text-sm text-gray-600">15 submissions pending</p>
                </div>
              </div>
              <span className="text-sm text-blue-600 font-medium">Due Tomorrow</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Calendar" className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-gray-900">Parent-Teacher Conferences</p>
                  <p className="text-sm text-gray-600">Schedule meetings</p>
                </div>
              </div>
              <span className="text-sm text-amber-600 font-medium">This Week</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="FileText" className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Quarterly Grade Reports</p>
                  <p className="text-sm text-gray-600">Review and finalize</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Next Week</span>
            </div>
          </div>
        </CardContent>
</Card>
      </div>
      
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={handleStudentModalClose}
        onSuccess={handleStudentCreated}
      />
    </>
  );
};

export default Dashboard;