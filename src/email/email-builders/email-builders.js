const { MAILGUN_EMAIL, CONFIRM_EMAIL_URL } = process.env;

const composeEmailChangeRequestEmail = ({ to, token, username = 'user' }) => ({
  to,
  from: MAILGUN_EMAIL,
  template: 'change-email',
  subject: 'Email Change Request',
  context: {
    url: `${CONFIRM_EMAIL_URL}${token}`,
    username,
  },
});

module.exports = {
  composeEmailChangeRequestEmail,
};
