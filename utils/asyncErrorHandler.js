const asyncErrorHandler = (fn) => {
    console.log('inside async error handler')
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

module.exports = asyncErrorHandler;