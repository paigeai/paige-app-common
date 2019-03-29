const DEFAULT_ROLE = 'user';

const ROLES = {
  admin: 0,
  user: 1,
};

const hasAuthority = (user, role) => role[user.role] <= role;

module.exports = {
  DEFAULT_ROLE,
  ROLES,
  hasAuthority,
};
