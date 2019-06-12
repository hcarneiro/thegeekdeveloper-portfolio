import _ from 'lodash'

console.log(process.env)

const dev = !(process.env.NODE_ENV === 'production')
let privateConfig
if (dev) {
  try {
    privateConfig = require('../config/private.json')
  } catch (err) {
    privateConfig = undefined
  }
}

const oneSignalHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Authorization': `Basic ${dev && privateConfig ? privateConfig.ONESIGNAL_REST_API : process.env.ONESIGNAL_REST_API}`
}

const oneSignalMessage = {
  app_id: dev && privateConfig ? privateConfig.ONESIGNAL_APP_ID : process.env.ONESIGNAL_APP_ID,
  template_id: dev && privateConfig ? privateConfig.ONESIGNAL_TEMPLATE_ID : process.env.ONESIGNAL_TEMPLATE_ID,
  included_segments: ['All']
}

const oneSignalOptions = {
  baseURL: 'https://onesignal.com',
  port: 443,
  url: '/api/v1/notifications',
  method: 'POST',
  headers: oneSignalHeaders,
  data: oneSignalMessage
}

export const state = () => ({
  list: [],
  project: {}
})

export const mutations = {
  setProjects(state, projects) {
    state.list = projects
  },
  setProject(state, project) {
    state.project = project
  },
  addProject(state, project) {
    state.list.push(project)
  },
  updateProject(state, project) {
    const savedProject = _.find(state.list, { id: project.id })

    if (!savedProject.published && project.published) {
      // Send a push notification
      // when project is published
      this.$axios(oneSignalOptions)
    }

    _.merge(savedProject, project)
  }
}

export const actions = {
  getProjects({ commit }) {
    return this.$axios.get(`/api/projects`)
      .then((res) => {
        if (res.status === 200) {
          commit('setProjects', res.data)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getProjectById({ commit }, params) {
    return this.$axios.get(`/api/projects/${params.id}`)
      .then((res) => {
        if (res.status === 200) {
          commit('setProject', res.data)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getProjectBySlug({ commit }, slug) {
    return this.$axios.get(`/api/projects/slug/${slug}`)
      .then((res) => {
        if (res.status === 200) {
          commit('setProject', res.data)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  addProject({ commit }, data) {
    return this.$axios.post(`/api/projects`, data)
      .then((res) => {
        commit('addProject', res.data)

        if (res.data.published) {
          // Send a push notification
          // when project is published
          this.$axios(oneSignalOptions)
        }

        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  updateProject({ commit, rootState }, param) {
    return this.$axios.put(`/api/projects/${param.id}`, param.project)
      .then((res) => {
        commit('updateProject', res.data[1][0])
        if (res.data[1][0].id === rootState.projects.project.id) {
          commit('setProject', res.data[1][0])
        }
        return Promise.resolve(res.data[1][0])
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  removeProject({ commit }, projectId) {
    return this.$axios.delete(`/api/projects/${projectId}`)
  }
}
