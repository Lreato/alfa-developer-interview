const db = require('./db')

const Post = db.sequelize.define('postagens', {
  titulo: {
      type: db.Sequelize.STRING
  },
  conteudo: {
      type: db.Sequelize.TEXT
  }
})

module.exports = Post //Exporta o arquivo para outros codigos utilizarem

//EXECUTAR UMA UNICA VEZPost.sync({force: true})
