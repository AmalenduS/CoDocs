// const logger = require('./logger');

module.exports.handleResponse = ({
  res,
  statusCode = 200,
  msg = 'Success',
  data = {},
  result = 1,
}) => {
  // res.status(statusCode).send({ result, msg, data });
  let newToken = ''
  if (res.newAccessToken && res.newRefreshToken) {
    newToken = {
      accessToken: res.newAccessToken,
      refreshToken: res.newRefreshToken
    }
  }
  res.status(statusCode).send({ result, msg, data, newToken });
};

module.exports.handleError = ({
  res,
  statusCode = 500,
  err = 'error',
  result = 0,
  data = {},
}) => {
  // logger.error(err);
  if (err.code === 11000) {
    statusCode = 400;
    let keyName = 'some arbitary key';
    const matches = err.message.match(/index:(.*)_1/);
    if (matches) ([, keyName] = matches);
    if (keyName === 'phone') {
      err = 'Phone number is already in use';
    } else {
      err = `'${keyName}' can not be duplicate`;
    }
  }
  res.status(statusCode).send({
    result,
    msg: err instanceof Error ? err.message : (err.msg || err),
    data,
  });
};

module.exports.unAuthorized = (res) => {
  // logger.error('Unauthorized request')
  res.status(401).send({ msg: 'Unauthorized! you\'re not authorized for this route!' });
};
