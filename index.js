
/**
 * Expose `validate`.
 */

module.exports = validate;

/**
 * Return a `plugin` function with `options`.
 *
 * @param {Object} options (optional)
 */

function validate (options) {
  options = options || {};

  return function plugin (Model) {

    /**
     * Global validators.
     */

    Model.validators = [];

    /**
     * Add a validator `fn` to the Model with optional `attr` scope.
     *
     * @param {String} attr (optional)
     * @param {Function} fn
     */

    Model.validator = function (attr, fn) {
      if ('function' == typeof attr) fn = attr, attr = null;

      if (attr) {
        var schema = this.attrs[attr];
        if (!schema) throw new Error('unrecognized attribute "' + attr + '"');
        schema.validators = schema.validators || [];
        schema.validators.push(fn);
      } else {
        this.validators.push(fn);
      }

      return this;
    };

    /**
     * Mark as `attr` as invalid with a `message` and optional `context`.
     *
     * @param {String} attr
     * @param {String} message
     * @param {Object} context (optional)
     * @return {Model}
     */

    Model.prototype.invalid = function (attr, message, context) {
      context = context || {};
      context.attr = attr;
      context.message = message;
      this.errors = this.errors || [];
      this.errors.push(context);
      return this;
    };

    /**
     * Perform validations, and return a boolean of whether the model is
     * valid or not.
     *
     * @return {Boolean}
     */

    Model.prototype.validate = function () {
      var fns = this.Model.validators;
      this.errors = [];

      // global
      for (var i = 0, fn; fn = fns[i]; i++) fn(this);

      // attribute-specific
      for (var key in this.Model.attrs) {
        var schema = this.Model.attrs[key];
        var vals = schema.validators;
        var value = this.attrs[key];
        if (!vals) continue;

        for (var j = 0, val; val = vals[j]; j++) {
          var valid = val(value);
          if (valid) continue;
          this.invalid(key, '"' + key + '" is invalid', { value: value });
        }
      }

      return ! this.errors.length;
    };

  };
}