const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github2');
const { ObjectId } = require('mongodb');

const mongodb = require('../data/database');

const getUsersCollection = () => mongodb.getdatabase().db().collection('users');

const getSafeProfileValue = (values) =>
  Array.isArray(values) && values.length > 0 ? values[0].value : null;

module.exports = () => {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackURL =
    process.env.GITHUB_CALLBACK_URL || 'http://localhost:8080/auth/github/callback';

  if (!clientID || !clientSecret) {
    console.warn('GitHub OAuth is disabled. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.');
    return false;
  }

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUsersCollection().findOne({ _id: new ObjectId(id) });
      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['user:email']
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const usersCollection = getUsersCollection();
          const userData = {
            githubId: profile.id,
            username: profile.username || profile.displayName || 'github-user',
            displayName: profile.displayName || profile.username || 'GitHub User',
            email: getSafeProfileValue(profile.emails),
            avatarUrl: getSafeProfileValue(profile.photos),
            profileUrl: profile.profileUrl || null,
            provider: 'github',
            lastLogin: new Date()
          };

          const existingUser = await usersCollection.findOne({ githubId: profile.id });

          if (existingUser) {
            await usersCollection.updateOne({ _id: existingUser._id }, { $set: userData });
            const updatedUser = await usersCollection.findOne({ _id: existingUser._id });
            return done(null, updatedUser);
          }

          const response = await usersCollection.insertOne({
            ...userData,
            createdAt: new Date()
          });
          const newUser = await usersCollection.findOne({ _id: response.insertedId });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  return true;
};
