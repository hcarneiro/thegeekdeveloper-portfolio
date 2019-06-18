<template>
  <div class="admin-overlay" :class="{ 'active': show }">
    <div class="admin-header">
      <div class="heading-holder">
        <span>
          <font-awesome-icon icon="times" @click="closeOverlay" />
        </span>
        <h2>
          Projects
        </h2>
      </div>
      <div class="admin-add-project-holder">
        <div v-if="!addingProject" class="primary-button inline circle sm" @click.prevent="addProject">
          <font-awesome-icon icon="plus" />
        </div>
      </div>
    </div>

    <div v-if="addingProject" class="admin-projects-holder">
      <form ref="addProjectForm" @submit="checkForm">
        <div class="form-group">
          <label for="project-title">Title</label>
          <input
            id="project-title"
            v-model="projectTitle"
            type="text"
            class="form-control"
            placeholder="Enter a title"
          >
        </div>
        <div class="form-group">
          <label for="project-category">Category</label>
          <input
            id="project-category"
            v-model="projectCategory"
            type="text"
            class="form-control"
            placeholder="Enter a category"
          >
        </div>
        <div class="form-group">
          <label for="project-category">Tags</label>
          <input
            id="project-category"
            v-model="projectTags"
            type="text"
            class="form-control"
            placeholder="Enter a tags seperated by comma"
          >
        </div>
        <div class="form-group">
          <label for="project-thumb">Preview image</label>
          <div class="preview-image-btn-wrapper">
            <div class="primary-button inline sm">
              <span v-if="projectImage">Replace image</span>
              <span v-if="!projectImage && file">1 image selected</span>
              <span v-if="!file && !projectImage">Upload image</span>
              <input
                id="project-thumb"
                ref="projectFile"
                type="file"
                accept="image/*"
                class="form-control-file"
                @change="processFile"
              >
            </div>
            <div class="preview-image-preview">
              <img v-if="projectThumb" :src="projectThumb" alt="Preview image">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Page content</label>
          <textarea id="content-editor" v-model="projectContent" placeholder="Start typing..." />
        </div>
        <div class="form-group form-check">
          <input id="publish-project" v-model="projectPublished" type="checkbox" class="form-check-input">
          <label class="form-check-label" for="publish-project">Publish project?</label>
        </div>
        <div class="admin-button-holder">
          <div class="btn btn-link cancel-btn" @click.prevent="goBack">
            Cancel
          </div>
          <button type="submit" class="secondary-button inline sm">
            Save
          </button>
        </div>
      </form>
    </div>

    <div v-else class="admin-projects-holder">
      <loading v-if="loading" />
      <div v-if="projects && projects.length && !error && !loading" class="admin-projects-list row">
        <div v-for="(project, index) in projects" :key="index" class="col-md-4">
          <div class="card">
            <div class="project-image-holder">
              <img v-if="project.thumb" :src="project.thumb" :alt="project.title" class="project-image">
            </div>
            <div class="project-status">
              <span v-if="project.published" class="success-text">Published</span>
              <span v-else class="warning-text">Draft</span>
            </div>
            <div class="project-info">
              <div class="project-title">
                {{ project.title }}
              </div>
              <div class="project-category">
                {{ project.category }}
              </div>
            </div>
            <div class="project-controls">
              <span>
                <font-awesome-icon :icon="['far', 'edit']" @click="editProject(project.id)" />
              </span>
              <span>
                <font-awesome-icon :icon="['far', 'trash-alt']" @click="deleteProject(project.id)" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="admin-empty-list">
        <div v-if="error && !loading" class="jumbotron">
          <span style="color: #ff5959">
            <font-awesome-icon :icon="['far', 'dizzy']" />
          </span>
          <h3>Error getting projects</h3>
          <p><a href="#" @click.prevent="getProjects">Try again</a></p>
        </div>
        <div v-if="!error && !loading" class="jumbotron">
          <span>
            <font-awesome-icon :icon="['far', 'dizzy']" />
          </span>
          <h3>No projects found</h3>
          <p>Add your first project by clicking plus button above.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global textboxio */
import Loading from '~/components/Loading'
import { find } from 'lodash'
import { mapState } from 'vuex'

export default {
  components: {
    Loading
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      addingProject: false,
      editingProject: false,
      error: undefined,
      projectId: '',
      projectTitle: '',
      projectCategory: '',
      projectTags: '',
      projectImage: '',
      projectThumb: '',
      projectContent: '',
      projectPublished: false,
      file: '',
      editor: undefined,
      editorOptions: {
        ui: {
          autoresize: false
        },
        css: {
          stylesheets: [
            '/textboxio/resources/css/bootstrap.min.css'
          ]
        },
        images: {
          editing: {
            enabled: false
          },
          upload: {
            url: '/api/upload/thumb'
          }
        }
      },
      dialog: {
        message: 'Are you sure you want to delete the project?',
        options: {
          okText: 'Delete',
          cancelText: 'Cancel'
        }
      }
    }
  },
  computed: {
    ...mapState({
      projects: (state) => {
        return state.projects.list
      },
      adminOverlay: (state) => {
        return state.auth.showAdminOverlay
      }
    })
  },
  watch: {
    show(newVal) {
      if (this.adminOverlay.options && this.adminOverlay.options.projectId) {
        this.editProject(this.adminOverlay.options.projectId)
      }
    },
    addingProject(value) {
      if (value) {
        this.$nextTick(() => {
          this.editor = textboxio.replace('#content-editor', this.editorOptions)
        })
      }
    }
  },
  created() {
    this.getProjects()
  },
  mounted() {
    if (this.addingProject) {
      this.editor = textboxio.replace('#content-editor', this.editorOptions)
    }
  },
  methods: {
    getProjects() {
      this.loading = true

      return this.$store.dispatch('projects/getProjects')
        .then(() => {
          this.loading = false
        })
        .catch((error) => {
          this.error = error
          this.loading = false
        })
    },
    addProject(editing) {
      this.addingProject = true
      this.editingProject = !!editing && !editing.type
    },
    goBack() {
      this.addingProject = false
      this.projectTitle = ''
      this.projectCategory = ''
      this.projectTags = ''
      this.projectContent = ''
      this.projectImage = ''
      this.projectThumb = ''
      this.projectPublished = false
      this.file = ''
      this.$refs.addProjectForm.reset()
    },
    processFile() {
      this.file = this.$refs.projectFile.files[0]
    },
    submitProject() {
      const data = {
        title: this.projectTitle,
        category: this.projectCategory,
        tags: this.projectTags,
        content: this.projectContent,
        image: this.projectImage,
        thumb: this.projectThumb,
        published: this.projectPublished
      }

      this.goBack()

      if (this.editingProject) {
        const obj = {
          id: this.projectId,
          project: data
        }
        this.editingProject = false
        return this.$store.dispatch('projects/updateProject', obj)
          .catch((error) => {
            console.log('Error updating project', error)
          })
      }

      return this.$store.dispatch('projects/addProject', data)
        .catch((error) => {
          console.log('Error adding project', error)
        })
    },
    uploadImage(formData) {
      return this.$store.dispatch('media/uploadThumb', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    checkForm(event) {
      event.preventDefault()

      if (!this.file) {
        return this.submitProject()
      }

      const formData = new FormData()
      formData.append('file', this.file)

      this.uploadImage(formData)
        .then((response) => {
          this.file = ''
          this.projectImage = response.url
          this.projectThumb = response.thumbnail

          return this.submitProject()
        })
        .catch((error) => {
          console.log('Error uplaoding image', error)
        })
    },
    editProject(projectId) {
      const project = find(this.projects, { id: projectId })

      this.projectId = project.id
      this.projectTitle = project.title
      this.projectCategory = project.category
      this.projectTags = project.tags
      this.projectContent = project.content
      this.projectImage = project.image
      this.projectThumb = project.thumb
      this.projectPublished = project.published

      this.addProject(true)
    },
    deleteProject(projectId) {
      this.$dialog.confirm(this.dialog.message, this.dialog.options)
        .then((dialog) => {
          this.loading = true

          this.$store.dispatch('projects/removeProject', projectId)
            .then(() => {
              return this.getProjects()
            })
        })
        .catch(() => {})
    },
    closeOverlay() {
      this.$store.commit('auth/adminOverlay', {
        isOpen: false
      })
    }
  }
}
</script>
