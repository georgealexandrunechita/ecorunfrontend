import api from './api'

export const runService = {
  getUserRuns: (userId) =>
    api.get(`/runs/user/${userId}`),
}
