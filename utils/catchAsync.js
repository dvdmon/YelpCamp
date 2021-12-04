module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
// we return a function that uses the function we're passing into it by executing it,
// but also then catching any errors and passing them to next() which is the next error handler
// where we presumably would do something specific with that error (like tell the user
// or log it, etc)