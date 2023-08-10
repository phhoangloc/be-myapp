const bookRoutes = require('../routes/book.route')
const userRoutes = require('../routes/user.route')
const route = (app) => {
    app.use("/", userRoutes)
    app.use("/book", bookRoutes)
}

module.exports = route