const getLoggedInUserDetails = (req) => {
  return {
    'loggedInUserAvatar': req.user.picture,
    'loggedInUserEmail': req.user.email,
    'loggedInUserDisplayName': req.user.displayName,
  };
};

const addLoggedInUserDetails = (obj, req) => {
  const details = getLoggedInUserDetails(req);
  // Spelling it out for JS parsers thar don't understand spreading.
  obj['loggedInUserAvatar'] = details['loggedInUserAvatar'];
  obj['loggedInUserEmail'] = details['loggedInUserEmail'];
  obj['loggedInUserDisplayName'] = details['loggedInUserDisplayName'];
};

const oneRandomLetter = () => {
  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
};

module.exports = {
  addLoggedInUserDetails,
  getLoggedInUserDetails,
  oneRandomLetter,
};
