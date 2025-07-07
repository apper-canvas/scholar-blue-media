import attendanceData from '@/services/mockData/attendance.json';

let attendance = [...attendanceData];

export const attendanceService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...attendance];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const record = attendance.find(a => a.Id === parseInt(id));
    return record ? { ...record } : null;
  },

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendance.filter(a => a.studentId === String(studentId));
  },

  async getByClassId(classId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendance.filter(a => a.classId === String(classId));
  },

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendance.filter(a => {
      const date = new Date(a.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  },

  async create(attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id)) + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      attendance[index] = { ...attendance[index], ...attendanceData };
      return { ...attendance[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      attendance.splice(index, 1);
      return true;
    }
    return false;
  }
};