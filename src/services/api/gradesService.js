import gradesData from '@/services/mockData/grades.json';

let grades = [...gradesData];

export const gradesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...grades];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades.filter(g => g.studentId === String(studentId));
  },

  async getByAssignmentId(assignmentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades.filter(g => g.assignmentId === String(assignmentId));
  },

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newGrade = {
      ...gradeData,
      Id: Math.max(...grades.map(g => g.Id)) + 1,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      return { ...grades[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades.splice(index, 1);
      return true;
    }
    return false;
  }
};