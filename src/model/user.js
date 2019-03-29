const { Model, snakeCaseMappers } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $toJson(json) {
    json = super.$toJson(json);
    delete json.password;
    return json;
  }
}

module.exports = User;
