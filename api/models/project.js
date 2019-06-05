const Sequelize = require('sequelize')
const database = require('../../config/database')

const Project = database.db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tags: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING
  },
  thumb: {
    type: Sequelize.STRING
  },
  published: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  content: {
    type: Sequelize.TEXT
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
}, {
  paranoid: true
});

module.exports = Project