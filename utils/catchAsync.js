module.exports = func => {
    return (req, res, next) => {
        func(res, res, next).catch(next);
    }
}