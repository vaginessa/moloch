import Vue from 'vue';

export default {
  getParliament: function () {
    return new Promise((resolve, reject) => {
      Vue.axios.get('api/parliament')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },

  createGroup: function (newGroup) {
    return new Promise((resolve, reject) => {
      Vue.axios.post('api/groups', newGroup)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },

  editGroup: function (groupId, updatedGroup) {
    return new Promise((resolve, reject) => {
      Vue.axios.put(`api/groups/${groupId}`, updatedGroup)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },

  deleteGroup: function (groupId) {
    return new Promise((resolve, reject) => {
      Vue.axios.delete(`api/groups/${groupId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  },

  createCluster: function (groupId, newCluster) {
    return new Promise((resolve, reject) => {
      Vue.axios.post(`api/groups/${groupId}/clusters`, newCluster)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  }
};
