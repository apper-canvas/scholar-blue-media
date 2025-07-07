export const classesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject" } },
          { field: { Name: "period" } },
          { field: { Name: "room" } },
          { field: { Name: "semester" } },
          { field: { Name: "year" } },
          { field: { Name: "teacher_id" } }
        ]
      };

      const response = await apperClient.fetchRecords('class', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to component expected format
      return response.data.map(classItem => ({
        Id: classItem.Id,
        name: classItem.Name,
        subject: classItem.subject,
        period: classItem.period,
        room: classItem.room,
        semester: classItem.semester,
        year: classItem.year,
        teacherId: classItem.teacher_id,
        tags: classItem.Tags,
        owner: classItem.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "subject" } },
          { field: { Name: "period" } },
          { field: { Name: "room" } },
          { field: { Name: "semester" } },
          { field: { Name: "year" } },
          { field: { Name: "teacher_id" } }
        ]
      };

      const response = await apperClient.getRecordById('class', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      // Map database fields to component expected format
      const classItem = response.data;
      return {
        Id: classItem.Id,
        name: classItem.Name,
        subject: classItem.subject,
        period: classItem.period,
        room: classItem.room,
        semester: classItem.semester,
        year: classItem.year,
        teacherId: classItem.teacher_id,
        tags: classItem.Tags,
        owner: classItem.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching class with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Name: classData.name,
        subject: classData.subject,
        period: parseInt(classData.period),
        room: classData.room,
        semester: classData.semester,
        year: parseInt(classData.year) || new Date().getFullYear(),
        teacher_id: classData.teacherId
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.createRecord('class', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message);
        }

        // Map database response back to component format
        const created = successfulRecords[0].data;
        return {
          Id: created.Id,
          name: created.Name,
          subject: created.subject,
          period: created.period,
          room: created.room,
          semester: created.semester,
          year: created.year,
          teacherId: created.teacher_id
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Id: parseInt(id),
        Name: classData.name,
        subject: classData.subject,
        period: parseInt(classData.period),
        room: classData.room,
        semester: classData.semester,
        year: parseInt(classData.year),
        teacher_id: classData.teacherId
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.updateRecord('class', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message);
        }

        // Map database response back to component format
        const updated = successfulUpdates[0].data;
        return {
          Id: updated.Id,
          name: updated.Name,
          subject: updated.subject,
          period: updated.period,
          room: updated.room,
          semester: updated.semester,
          year: updated.year,
          teacherId: updated.teacher_id
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('class', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return false;
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting class:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};