const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

function configurePassport(passport, config) {
  const hasKeys =
    Boolean(config.OAUTH_GOOGLE_CLIENT_ID) &&
    Boolean(config.OAUTH_GOOGLE_CLIENT_SECRET);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  if (!hasKeys) {
    return false;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: config.OAUTH_GOOGLE_CLIENT_SECRET,
        callbackURL: config.OAUTH_GOOGLE_CALLBACK_URL,
      },
      (_accessToken, _refreshToken, profile, done) => {
        const mappedUser = {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || null,
        };

        done(null, mappedUser);
      },
    ),
  );

  return true;
}

module.exports = { configurePassport };
