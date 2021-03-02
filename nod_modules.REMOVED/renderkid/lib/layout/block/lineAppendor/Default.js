// Generated by CoffeeScript 1.9.3
var DefaultLineAppendor, tools,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

tools = require('../../../tools');

module.exports = DefaultLineAppendor = (function(superClass) {
  extend(DefaultLineAppendor, superClass);

  function DefaultLineAppendor() {
    return DefaultLineAppendor.__super__.constructor.apply(this, arguments);
  }

  DefaultLineAppendor.prototype._render = function(inherited, options) {
    return inherited + tools.repeatString(" ", this._config.amount);
  };

  return DefaultLineAppendor;

})(require('./_LineAppendor'));
