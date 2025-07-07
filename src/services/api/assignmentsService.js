import assignmentsData from '@/services/mockData/assignments.json';

let assignments = [...assignmentsData];

export const assignmentsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...assignments];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByClassId(classId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return assignments.filter(a => a.classId === String(classId));
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...assignments.map(a => a.Id)) + 1
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData };
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments.splice(index, 1);
      return true;
    }
    return false;
  }
};