import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | sidenote', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    const note = {
      id: 1,
      offsetY: 100,
      data: { foo: 'bar' },
    };

    this.setProperties({
      note,
      onRegister: () => {},
      onResize: () => {},
      onSelect: () => {},
      onUnselect: () => {},
    });
  });

  test('it registers sidenote to parent', async function (assert) {
    assert.expect(4);
    const done = assert.async();

    this.set('onRegister', ({ element, id, offsetY, data }) => {
      assert.equal(this.note.id, id, 'onRegister receives correct id');
      assert.equal(
        this.note.offsetY,
        offsetY,
        'onRegister receives correct offsetY'
      );
      assert.equal(this.note.data, data, 'onRegister receives correct data');
      assert.ok(element, 'onRegister receives a truthy element');

      done();
    });

    await render(hbs`
      <Sidenote
        @id={{this.note.id}}
        @offsetY={{this.note.offsetY}}
        @data={{this.note.data}}
        @onRegister={{this.onRegister}}
        @onResize={{this.onResize}}
        @onSelect={{this.onSelect}}
        @onUnselect={{this.onUnselect}}
      />
    `);
  });

  test('it expose isActive with correct value', async function (assert) {
    this.set('selectedSidenoteId', this.note.id);

    await render(hbs`
      <Sidenote
        @id={{this.note.id}}
        @onRegister={{this.onRegister}}
        @onResize={{this.onResize}}
        @onSelect={{this.onSelect}}
        @onUnselect={{this.onUnselect}}
        @selectedSidenoteId={{this.selectedSidenoteId}}
        as |s|
      >
        {{#if s.isActive}}
          <div data-active-sidenote>This is some dummy text.</div>
        {{/if}}
      </Sidenote>
    `);

    assert.dom('[data-active-sidenote]').exists('isActive is exposed as true');

    this.set('selectedSidenoteId', -1);

    assert
      .dom('[data-active-sidenote]')
      .doesNotExist('isActive is exposed as false');
  });

  test('it triggers onResize when element size change', async function (assert) {
    this.setProperties({
      showMore: false,
      onResizeCalled: false,
      onResize: () => {
        this.set('onResizeCalled', true);
      },
    });

    await render(hbs`
      <Sidenote
        @id={{this.note.id}}
        @onRegister={{this.onRegister}}
        @onResize={{this.onResize}}
        @onSelect={{this.onSelect}}
        @onUnselect={{this.onUnselect}}
      >
        {{#if this.showMore}}
          <div data-show-more></div>
        {{/if}}
      </Sidenote>
    `);

    this.set('showMore', true);
    await waitUntil(() => this.onResizeCalled);

    assert.dom('[data-show-more]').exists();

    this.set('showMore', false);
    await waitUntil(() => this.onResizeCalled);
    assert.ok(this.onResizeCalled, 'onResize has been called');

    assert.dom('[data-show-more]').doesNotExist();
  });

  test('it calls onSelect and onUnselect when using exposed actions', async function (assert) {
    assert.expect(2);
    const onSelectDone = assert.async();
    const onUnselectDone = assert.async();

    this.setProperties({
      onSelect: () => {
        assert.ok(true, 'onSelect is called');
        onSelectDone();
      },
      onUnselect: () => {
        assert.ok(true, 'onUnselect is called');
        onUnselectDone();
      },
    });

    await render(hbs`
      <Sidenote
        @id={{this.note.id}}
        @onRegister={{this.onRegister}}
        @onResize={{this.onResize}}
        @onSelect={{this.onSelect}}
        @onUnselect={{this.onUnselect}}
        as |s|
      >
        <button
          data-select-button
          type="button"
          {{on 'click' s.select}}
        >Select</button>
        <button
          data-unselect-button
          type="button"
          {{on 'click' s.unselect}}
        >Unselect</button>
      </Sidenote>
    `);

    await click('[data-select-button]');
    await click('[data-unselect-button]');
  });
});
