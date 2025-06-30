'use strict';

module.exports = {
  jwt: {
    secret: (function() {
      if (!process.env.JWT_SECRET) {
        console.error('ERROR: JWT_SECRET environment variable not set. Application will exit.');
        process.exit(1);
      }
      return process.env.JWT_SECRET;
    })(),
    sign: {
      algorithm: 'HS512',
      expiresInMinutes: 1,
      noTimestamp: false
    },
    verify: {
      ignoreExpiration: false
    }
  }
};
