const Knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('./db-config');

module.exports = options => {
  options = Object.assign(
    {
      useNullAsDefault: true,
    },
    options,
  );

  //
  // Initialize knex.
  //
  const knex = Knex({
    ...knexConfig,
    ...options,
  });

  //
  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex method.
  //
  Model.knex(knex);
};
