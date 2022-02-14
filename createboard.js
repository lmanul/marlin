
module.exports = {
  createPost: () => {
    console.log('Creation');
    return Promise.resolve('testid');
  },
};
