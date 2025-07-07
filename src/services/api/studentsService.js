import studentsData from '@/services/mockData/students.json';

let students = [...studentsData];

export const studentsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = students.find(s => s.Id === parseInt(id));
    return student ? { ...student } : null;
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id)) + 1,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      return { ...students[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      students.splice(index, 1);
      return true;
    }
    return false;
  }
};