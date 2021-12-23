export const mock = (function () {
  var store = {};
  return {
    getItem: function (key) {
      return store[key];
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    }
  };
})();

export const getDebugValue = (): string | null => {
  return sessionStorage.getItem('debug');
};
