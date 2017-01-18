exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ?
                           'mongodb://blog-user:payal123@ds111479.mlab.com:11479/blog-posts' :
                           'mongodb://localhost/blog-app');
exports.PORT = process.env.PORT || 8080;