(function() {
  exports.capitalize = function(string) {
    return string[0].toUpperCase() + string.slice(1);
  };

  exports.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

}).call(this);
