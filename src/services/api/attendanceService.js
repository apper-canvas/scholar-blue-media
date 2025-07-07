export const attendanceService = {
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
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "class_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ]
      };

      const response = await apperClient.fetchRecords('attendance', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to component expected format
      return response.data.map(attendance => ({
        Id: attendance.Id,
        studentId: attendance.student_id?.Id || attendance.student_id,
        classId: attendance.class_id?.Id || attendance.class_id,
        date: attendance.date,
        status: attendance.status,
        reason: attendance.reason,
        name: attendance.Name,
        tags: attendance.Tags,
        owner: attendance.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
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
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "class_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "reason" } }
        ]
      };

      const response = await apperClient.getRecordById('attendance', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      // Map database fields to component expected format
      const attendance = response.data;
      return {
        Id: attendance.Id,
        studentId: attendance.student_id?.Id || attendance.student_id,
        classId: attendance.class_id?.Id || attendance.class_id,
        date: attendance.date,
        status: attendance.status,
        reason: attendance.reason,
        name: attendance.Name,
        tags: attendance.Tags,
        owner: attendance.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Name: `Attendance for ${attendanceData.studentId}`,
        student_id: parseInt(attendanceData.studentId),
        class_id: parseInt(attendanceData.classId),
        date: attendanceData.date,
        status: attendanceData.status,
        reason: attendanceData.reason || ''
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.createRecord('attendance', params);

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
          studentId: created.student_id,
          classId: created.class_id,
          date: created.date,
          status: created.status,
          reason: created.reason
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Id: parseInt(id),
        Name: `Attendance for ${attendanceData.studentId}`,
        student_id: parseInt(attendanceData.studentId),
        class_id: parseInt(attendanceData.classId),
        date: attendanceData.date,
        status: attendanceData.status,
        reason: attendanceData.reason || ''
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.updateRecord('attendance', params);

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
          studentId: updated.student_id,
          classId: updated.class_id,
          date: updated.date,
          status: updated.status,
          reason: updated.reason
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('attendance', params);

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
        console.error("Error deleting attendance:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};