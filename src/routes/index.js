const bookRoutes = require('../routes/book.route')
const userRoutes = require('../routes/user.route')
const blogRoutes = require('./blog.route')
const route = (app) => {
    app.use("/", userRoutes)
    app.use("/book", bookRoutes)
    app.use("/blog", blogRoutes)
}

module.exports = route