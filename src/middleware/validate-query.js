const { BadRequestError } = require('../error');

module.exports = config => (req, res, next) => {
  try {
    const errors = [];
    const params = Object.keys(config);

    for (let i = 0; i < params.length; ++i) {
      const paramName = params[i];
      const paramConfig = config[paramName];
      const paramValue = req.query[paramName];

      // check if param is missing and required
      if (paramValue === undefined && paramConfig.defaultValue) {
        req.query[paramName] = paramConfig.defaultValue;
      } else if (paramValue === undefined && paramConfig.required === true) {
        errors.push(`query parameter '${paramName}' is required`);
        continue;
      }

      let isValidType = true;

      // type checking and conversion if needed
      if (paramConfig.type) {
        switch (paramConfig.type) {
          case Boolean:
            if (paramValue === 'true') {
              req.query[paramName] = true;
            } else if (paramValue === 'false') {
              req.query[paramName] = false;
            } else {
              isValidType = false;
            }

            break;
          case Number:
            if (paramValue === 'true' || paramValue === 'false') {
              isValidType = false;
            } else if (!Number.isInteger(Number(paramValue))) {
              isValidType = false;
            } else {
              req.query[paramName] = Number(paramValue);
            }

            break;
          case Date: {
            const date = new Date(req.query[paramName]);

            if (Number.isNaN(Number(date))) {
              isValidType = true;
            } else {
              req.query[paramName] = date;
            }

            break;
          }
          case 'JSON':
            try {
              req.query[paramName] = JSON.parse(paramValue);
            } catch (e) {
              isValidType = false;
            }

            break;
          default:
            break;
        }
      }

      if (!isValidType) {
        errors.push(`invalid value '${paramValue}' for query parameter '${paramName}'`);
        continue;
      }

      // run validation function if provided
      if (paramConfig.validate && paramConfig.validate(req.query[paramName]) === false) {
        errors.push(`invalid value '${req.query[paramName]}' for query parameter '${paramName}'`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestError('Invalid query parameters', errors);
    }

    next();
  } catch (e) {
    next(e);
  }
};
