
/**
 * Expose `validate`.
 */

module.exports = validate;

/**
 * Return a `plugin` function with `options`.
 *
 * @param {Object} options (optional)
 *   @property {String} separator
 */

function validate (options) {
  options = options || {};

  return function plugin (Model) {
    Model.validators = [];

    /**
     * Add a `validator` to the Model.
     *
     * @param {Function} validator
     */

    Model.validator = function (validator) {
      this.validators.push(validator);
      return this;
    };

    /**
     * Register an error `message` on `attr`.
     *
     * @param {String} attr
     * @param {String} message
     * @return {Model}
     */

    Model.prototype.error = function (attr, message) {
      this.errors = this.errors || [];
      this.errors.push({
        attr: attr,
        message: message
      });
      return this;
    };

    /**
     * Perform validations, and return a boolean of whether the model is
     * valid or not.
     *
     * @return {Boolean}
     */

    Model.prototype.validate = function(){
      var fns = this.Model.validators;
      this.errors = [];
      for (var i = 0, fn; fn = fns[i]; i++) fn(this);
      return ! this.errors.length;
    };

  };
}