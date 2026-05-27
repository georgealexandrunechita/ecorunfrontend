import api from './api'

export const userService = {
  getRanking: (limit = 10) =>
    api.get('/users/ranking', { params: { limit } }),

  getAchievements: (userId) =>
    api.get(`/users/${userId}/achievements`),
}
