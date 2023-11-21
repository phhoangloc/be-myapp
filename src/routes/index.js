const { AdminAuthen, UserAuthen } = require('../midleware/midlewares')
const bookRoutes = require('./book.route')
const userRoutes = require('./user.route')
const adminRoutes = require('./admin.route')
const blogRoutes = require('./blog.route')

const route = (app) => {
    app.use("/", userRoutes)
    app.use("/admin", UserAuthen, AdminAuthen, adminRoutes)
    app.use("/book", bookRoutes)
    app.use("/blog", blogRoutes)
}

module.exports = route