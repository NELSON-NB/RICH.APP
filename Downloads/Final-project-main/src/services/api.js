
const API_BASE_URL = 'http://localhost/finalproject/src/backend';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users
  async getUsers() {
    return this.request('users');
  }

  async getUser(id) {
    return this.request(`users/${id}`);
  }

  async createUser(userData) {
    return this.request('users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`users/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();



