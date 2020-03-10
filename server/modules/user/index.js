module.exports = {
  init: () => {},
  add: async function(msg) {
    return {
      status: 0
    };
  },
  edit: msg => {
    return {
      status: 0
    };
  },
  get: msg => {
    return [
      {
        firstName: "Dido",
        lastName: "E pich"
      }
    ];
  }
};
