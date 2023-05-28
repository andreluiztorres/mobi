function GerarHashS3() {
    const crypto = require('crypto');
    const hash = crypto.randomBytes(10).toString('hex');
    return hash;
}

module.exports = GerarHashS3;