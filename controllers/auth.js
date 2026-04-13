const getSafeUser = (user) => ({
  id: user._id,
  githubId: user.githubId,
  username: user.username,
  displayName: user.displayName,
  email: user.email,
  avatarUrl: user.avatarUrl,
  provider: user.provider
});

const status = (req, res) => {
  const authenticated = req.isAuthenticated && req.isAuthenticated();

  res.status(200).json({
    authenticated,
    user: authenticated ? getSafeUser(req.user) : null,
    loginUrl: req.app.locals.authEnabled ? '/auth/login' : null
  });
};

const profile = (req, res) => {
  res.status(200).json(getSafeUser(req.user));
};

const loginSuccess = (req, res) => {
  res.redirect('/auth/profile');
};

const loginFailed = (_req, res) => {
  res.status(401).json({ error: 'GitHub authentication failed' });
};

const logout = (req, res) => {
  req.logout((logoutError) => {
    if (logoutError) {
      console.error('Error logging out user:', logoutError);
      return res.status(500).json({ error: 'Failed to log out user' });
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        console.error('Error destroying session:', sessionError);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};

module.exports = {
  status,
  profile,
  loginSuccess,
  loginFailed,
  logout
};
