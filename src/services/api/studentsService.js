export const studentsService = {
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "grade" } },
          { field: { Name: "date_of_birth" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.fetchRecords('student', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to component expected format
      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name,
        lastName: student.last_name,
        grade: student.grade,
        dateOfBirth: student.date_of_birth,
        email: student.email,
        phone: student.phone,
        address: student.address,
        enrollmentDate: student.enrollment_date,
        status: student.status,
        name: student.Name,
        tags: student.Tags,
        owner: student.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
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
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "grade" } },
          { field: { Name: "date_of_birth" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await apperClient.getRecordById('student', id, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      // Map database fields to component expected format
      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name,
        lastName: student.last_name,
        grade: student.grade,
        dateOfBirth: student.date_of_birth,
        email: student.email,
        phone: student.phone,
        address: student.address,
        enrollmentDate: student.enrollment_date,
        status: student.status,
        name: student.Name,
        tags: student.Tags,
        owner: student.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Name: `${studentData.firstName} ${studentData.lastName}`,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        grade: parseInt(studentData.grade),
        date_of_birth: studentData.dateOfBirth,
        email: studentData.email,
        phone: studentData.phone,
        address: studentData.address,
        enrollment_date: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
        status: studentData.status || 'active'
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.createRecord('student', params);

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
          firstName: created.first_name,
          lastName: created.last_name,
          grade: created.grade,
          dateOfBirth: created.date_of_birth,
          email: created.email,
          phone: created.phone,
          address: created.address,
          enrollmentDate: created.enrollment_date,
          status: created.status,
          name: created.Name
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map component data to database fields (only Updateable fields)
      const dbRecord = {
        Id: parseInt(id),
        Name: `${studentData.firstName} ${studentData.lastName}`,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        grade: parseInt(studentData.grade),
        date_of_birth: studentData.dateOfBirth,
        email: studentData.email,
        phone: studentData.phone,
        address: studentData.address,
        enrollment_date: studentData.enrollmentDate,
        status: studentData.status
      };

      const params = {
        records: [dbRecord]
      };

      const response = await apperClient.updateRecord('student', params);

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
          firstName: updated.first_name,
          lastName: updated.last_name,
          grade: updated.grade,
          dateOfBirth: updated.date_of_birth,
          email: updated.email,
          phone: updated.phone,
          address: updated.address,
          enrollmentDate: updated.enrollment_date,
          status: updated.status,
          name: updated.Name
        };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('student', params);

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
        console.error("Error deleting student:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};