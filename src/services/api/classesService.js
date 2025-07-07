import classesData from '@/services/mockData/classes.json';

let classes = [...classesData];

export const classesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...classes];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classItem = classes.find(c => c.Id === parseInt(id));
    return classItem ? { ...classItem } : null;
  },

  async create(classData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newClass = {
      ...classData,
      Id: Math.max(...classes.map(c => c.Id)) + 1,
      year: new Date().getFullYear()
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      classes[index] = { ...classes[index], ...classData };
      return { ...classes[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      classes.splice(index, 1);
      return true;
    }
    return false;
  }
};