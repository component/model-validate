
var assert = require('assert');

try {
  var validate = require('hades-validate');
  var hades = require('hades');
} catch (e) {
  var validate = require('..');
  var hades = require('../../hades');
}

describe('hades-validate', function () {

  describe('.validators', function () {
    it('should be an array', function () {
      var Model = hades().use(validate());
      assert(Model.validators instanceof Array);
    });
  });

  describe('.validator', function () {
    it('should add a validator', function () {
      var noop = function(){};
      var Model = hades().use(validate()).validator(noop);
      assert.equal(noop, Model.validators[0]);
    });
  });

  describe('#error', function () {
    it('should add an error object', function () {
      var Model = hades().use(validate()).attr('name');
      var model = new Model();
      model.error('name', 'message');
      assert.deepEqual({ attr: 'name', message: 'message' }, model.errors[0]);
    });
  });

  describe('#validate', function () {
    it('should call validators with the model', function (done) {
      var Model = hades().use(validate()).validator(validator);
      var model = new Model();
      model.validate();

      function validator (instance) {
        assert.equal(model, instance);
        done();
      }
    });

    it('should return the model\'s validity', function () {
      var Model = hades()
        .use(validate())
        .attr('name')
        .validator(validator);

      var model = new Model();
      assert(!model.validate());

      function validator (model) {
        model.error('name', 'message');
      }
    });
  });

});
