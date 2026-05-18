import api from './api'

export const userService = {
  getRanking: (limit = 10) =>
    api.get('/users/ranking', { params: { limit } }),
}
