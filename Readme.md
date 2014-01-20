
# model-validate

  A plugin that adds validators to a model.

## Installation

    $ component install component/model-validate

## Example

```js
var model = require('model');
var validate = require('validate');
var isEmail = require('is-email');
var isUrl = require('is-url');

/**
 * User model.
 */

var User = model()
  .use(validate())
  .attr('id')
  .attr('email', { validators: [isEmail] })
  .attr('website', { validators: [isUrl] });

/**
 * Usage...
 */

var user = new User({ email: 'invalid' });
var valid = user.validate();

if (!valid) {}
  var error = user.errors[0];
  throw new Error('invalid attribute "' + error.attr + '"');
}
```

## API

#### .validator([attr], fn)

  Register a validator `fn`. It can be either:
 
  * **attribute specific** - passing an `attr`, in which case it will be called with the value of `attr`.
  * **global** - omitting the `attr`, in which case it will be called with the model itself.

  Attribute-specific validators can also be specified by just adding a `validators` property to an attribute's options.

#### #invalid(attr, message [context])

  Mark an `attr` as invalid, with a `message` and optional extra `context`.

#### #validate

  Validate the model, returning a boolean of its validity, and populating `model.errors` with errors for each failed validation.