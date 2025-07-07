export const gradesService = {
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
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.fetchRecords('grade', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to component expected format
      return response.data.map(grade => ({
        Id: grade.Id,
        studentId: grade.student_id?.Id || grade.student_id,
        assignmentId: grade.assignment_id?.Id || grade.assignment_id,
        score: grade.score,
        submittedDate: grade.submitted_date,
        comments: grade.comments,
        name: grade.Name,
        tags: grade.Tags,
        owner: grade.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('grade', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      // Map database fields to component expected format
      const grade = response.data;
      return {
        Id: grade.Id,
        studentId: grade.student_id?.Id || grade.student_id,
        assignmentId: grade.assignment_id?.Id || grade.assignment_id,
        score: grade.score,
        submittedDate: grade.submitted_date,
        comments: grade.comments,
        name: grade.Name,
        tags: grade.Tags,
        owner: grade.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Name: `Grade for ${gradeData.studentId}`,
        score: parseInt(gradeData.score),
        submitted_date: gradeData.submittedDate || new Date().toISOString().split('T')[0],
        comments: gradeData.comments || '',
        student_id: parseInt(gradeData.studentId),
        assignment_id: parseInt(gradeData.assignmentId)
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.createRecord('grade', params);

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
          assignmentId: created.assignment_id,
          score: created.score,
          submittedDate: created.submitted_date,
          comments: created.comments
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Id: parseInt(id),
        Name: `Grade for ${gradeData.studentId}`,
        score: parseInt(gradeData.score),
        submitted_date: gradeData.submittedDate,
        comments: gradeData.comments,
        student_id: parseInt(gradeData.studentId),
        assignment_id: parseInt(gradeData.assignmentId)
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.updateRecord('grade', params);

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
          assignmentId: updated.assignment_id,
          score: updated.score,
          submittedDate: updated.submitted_date,
          comments: updated.comments
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('grade', params);

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
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};