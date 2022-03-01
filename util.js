const getLoggedInUserDetails = (req) => {
  return {
    'loggedInUserAvatar': req.user.picture,
    'loggedInUserEmail': req.user.email,
  };
};

module.exports = {
  getLoggedInUserDetails,
};
