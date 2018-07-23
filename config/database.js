if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://charlie:qwerty101ck@ds143511.mlab.com:43511/node-prod'
    }
} else {
    module.exports ={
        mongoURI:"mongodb://localhost:27017/node-app"
    }
}