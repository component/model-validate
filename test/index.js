
var assert = require('assert');
var noop = function(){};

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
    it('should add a global validator', function () {
      var Model = hades().use(validate()).validator(noop);
      assert.equal(noop, Model.validators[0]);
    });

    it('should add an attr validator', function () {
      var Model = hades().use(validate()).attr('id').validator('id', noop);
      assert.equal(noop, Model.attrs.id.validators[0]);
    });
  });

  describe('#invalid', function () {
    it('should add an error object', function () {
      var Model = hades().use(validate()).attr('name');
      var model = new Model();
      model.invalid('name', 'message', { context: true });
      assert.deepEqual(model.errors[0], {
        attr: 'name',
        message: 'message',
        context: true
      });
    });
  });

  describe('#validate', function () {
    it('should call global validators with the model', function (done) {
      var Model = hades().use(validate()).validator(fn);
      var model = new Model();
      model.validate();

      function fn (instance) {
        assert.equal(model, instance);
        done();
      }
    });

    it('should call attr validators with the value', function (done) {
      var Model = hades().use(validate()).attr('name').validator('name', fn);
      var model = new Model({ name: 'Name' });
      model.validate();

      function fn (val) {
        assert.equal('Name', val);
        done();
      }
    });

    it('should fail on global validators', function () {
      var Model = hades()
        .use(validate())
        .attr('name')
        .validator(fn);

      var model = new Model();
      assert(!model.validate());
      assert.deepEqual(model.errors[0], {
        attr: 'name',
        message: 'message'
      });

      function fn (model) {
        model.invalid('name', 'message');
      }
    });

    it('should fail on attr validators', function () {
      var Model = hades()
        .use(validate())
        .attr('name')
        .validator('name', fn);

      var model = new Model({ name: 'Name' });
      assert(!model.validate());
      assert.deepEqual(model.errors[0], {
        attr: 'name',
        message: '"name" is invalid',
        value: 'Name'
      });

      function fn (val) {
        return false;
      }
    });
  });

});
