'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    // @ember/render-modifiers is a declared runtime dependency of this addon;
    // migration to a custom modifier is a future refactor.
    'no-at-ember-render-modifiers': 'off',
  },
};
