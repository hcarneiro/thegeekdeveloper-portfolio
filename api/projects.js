const express = require('express')
const router = express.Router()
const database = require('../config/database')
const auth = require('../config/authentication')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

router.get('/', (req, res) => {
  database.db.models.project.findAll({
    order: [
      ['createdAt', 'ASC']
    ]
  })
    .then((results) => {
      if (typeof results === 'undefined') {
        return res.status(400).send({
          message: 'We couldn\'t get the list of projects'
        })
      }

      res.send(results)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.get('/:id', async (req, res) => {
  database.db.models.project.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((result) => {
      res.send(result)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

router.get('/slug/:slug', async (req, res) => {
  database.db.models.project.findOne({
    where: {
      slug: req.params.slug
    }
  })
    .then((result) => {
      res.send(result)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

router.post('/', auth, (req, res) => {
  const data = req.body
  data.slug = slugify(data.title)

  database.db.models.project.findAndCountAll({
    where: {
      slug: {
        [Op.regexp]: '^(' + data.slug + ')'
      }
    }
  })
    .then((result) => {
      return result.count
    })
    .then((count) => {
      if (count) {
        data.slug = `${data.slug}-${count}`
      }

      return database.db.models.project.create(req.body)
    })
    .then((project) => {
      res.send(project)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

router.put('/:id', auth, (req, res) => {
  const data = req.body
  data.slug = slugify(data.title)

  database.db.models.project.findAndCountAll({
    where: {
      slug: {
        [Op.regexp]: '^(' + data.slug + ')'
      }
    }
  })
    .then((result) => {
      return result.count
    })
    .then((count) => {
      if (count) {
        data.slug = `${data.slug}-${count}`
      }

      return database.db.models.project.update(data, {
        where: {
          id: req.params.id
        },
        returning: true
      })
    })
    .then((project) => {
      res.send(project)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

router.delete('/:id', auth, (req, res) => {
  database.db.models.project.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.send();
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router