import api from './api'

export const challengeService = {
  getAll: (filters = {}) =>
    api.get('/challenges', { params: filters }),

  getById: (id) =>
    api.get(`/challenges/${id}`),

  join: (id) =>
    api.post(`/challenges/${id}/join`),

  getUserChallenges: (userId) =>
    api.get(`/challenges/user/${userId}`),
}
