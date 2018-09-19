// Cribbed from Wes Bos
//  https://github.com/wesbos/Learn-Node/blob/master/starter-files/handlers/errorHandlers.js#L1-L13
exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
