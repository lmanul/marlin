const getLoggedInUserDetails = (req) => {
  return {
    'loggedInUserAvatar': req.user.picture,
    'loggedInUserEmail': req.user.email,
    'loggedInUserDisplayName': req.user.displayName,
  };
};

const oneRandomLetter = () => {
  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
};

module.exports = {
  getLoggedInUserDetails,
  oneRandomLetter,
};
