const { ExtractJwt, Strategy } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { User } = require('../../model');
const { compare } = require('../crypto');

const { APP_SECRET } = process.env;

module.exports = passport => {
  // Define jwt authentication options
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: APP_SECRET,
  };

  // Define local login options
  const localOpts = {
    usernameField: 'email',
    passwordField: 'password',
  };

  // Initialize local login strategy
  const localStrategy = new LocalStrategy(localOpts, async (email, password, done) => {
    const user = await User.query()
      .select('*')
      .findOne({ email });

    if (!user) {
      return done(null, false);
    }

    const match = await compare(password, user.password);

    return match ? done(null, user) : done(null, false);
  });

  // Initialize jwt authentication strategy
  const jwtStrategy = new Strategy(jwtOpts, async (payload, done) => {
    const user = await User.query()
      .select('*')
      .findById(payload.id);

    return user ? done(null, user) : done(null, false);
  });

  passport.use(localStrategy);
  passport.use(jwtStrategy);
};
