import api from './api'

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (data) =>
    api.post('/auth/register', data),

  logout: () => {
    localStorage.removeItem('ecorun_token')
    localStorage.removeItem('ecorun_user')
  },

  getProfile: () =>
    api.get('/auth/profile'),
}
