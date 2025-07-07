export const assignmentsService = {
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
            field: { Name: "class_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "type" } },
          { field: { Name: "total_points" } },
          { field: { Name: "due_date" } },
          { field: { Name: "category" } },
          { field: { Name: "weight" } }
        ]
      };

      const response = await apperClient.fetchRecords('assignment', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to component expected format
      return response.data.map(assignment => ({
        Id: assignment.Id,
        name: assignment.Name,
        classId: assignment.class_id?.Id || assignment.class_id,
        type: assignment.type,
        totalPoints: assignment.total_points,
        dueDate: assignment.due_date,
        category: assignment.category,
        weight: assignment.weight,
        tags: assignment.Tags,
        owner: assignment.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
            field: { Name: "class_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "type" } },
          { field: { Name: "total_points" } },
          { field: { Name: "due_date" } },
          { field: { Name: "category" } },
          { field: { Name: "weight" } }
        ]
      };

      const response = await apperClient.getRecordById('assignment', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      // Map database fields to component expected format
      const assignment = response.data;
      return {
        Id: assignment.Id,
        name: assignment.Name,
        classId: assignment.class_id?.Id || assignment.class_id,
        type: assignment.type,
        totalPoints: assignment.total_points,
        dueDate: assignment.due_date,
        category: assignment.category,
        weight: assignment.weight,
        tags: assignment.Tags,
        owner: assignment.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Name: assignmentData.name,
        class_id: parseInt(assignmentData.classId),
        type: assignmentData.type,
        total_points: parseInt(assignmentData.totalPoints),
        due_date: assignmentData.dueDate,
        category: assignmentData.category,
        weight: parseFloat(assignmentData.weight)
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.createRecord('assignment', params);

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
          classId: created.class_id,
          type: created.type,
          totalPoints: created.total_points,
          dueDate: created.due_date,
          category: created.category,
          weight: created.weight
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Id: parseInt(id),
        Name: assignmentData.name,
        class_id: parseInt(assignmentData.classId),
        type: assignmentData.type,
        total_points: parseInt(assignmentData.totalPoints),
        due_date: assignmentData.dueDate,
        category: assignmentData.category,
        weight: parseFloat(assignmentData.weight)
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.updateRecord('assignment', params);

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
          classId: updated.class_id,
          type: updated.type,
          totalPoints: updated.total_points,
          dueDate: updated.due_date,
          category: updated.category,
          weight: updated.weight
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('assignment', params);

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
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};