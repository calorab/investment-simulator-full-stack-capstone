exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://Admin:admin123@ds135993.mlab.com:35993/investment-simulator';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://admin:drummer1@ds237989.mlab.com:37989/investment-simulator-test';
exports.PORT = process.env.PORT || 8080;
