import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { htmlSafe } from '@ember/template';

module('Integration | Component | sidenotes-wrapper', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.set('items', [
      { id: 1, y: 150, data: null },
      { id: 2, y: 278, data: null },
      { id: 3, y: 280, data: null },
      { id: 4, y: 330, data: null },
      { id: 5, y: 650, data: null },
      { id: 6, y: 750, data: null },
    ]);
  });

  test('it renders every sidenotes', async function (assert) {
    await render(hbs`
      <SidenotesWrapper @items={{this.items}} as |Sidenote item|>
        <Sidenote @id={{item.id}} @offsetY={{item.y}} @data={{item.data}}>
          <div data-sidenote></div>
        </Sidenote>
      </SidenotesWrapper>
    `);

    assert.dom('[data-sidenote]').exists({ count: this.items.length });
  });

  test('it works in non-controlled mode', async function (assert) {
    this.set('onSelectCalled', false);
    this.set('onSelect', () => {
      this.set('onSelectCalled', true);
    });

    this.set('onUnselectCalled', false);
    this.set('onUnselect', () => {
      this.set('onUnselectCalled', true);
    });

    await render(hbs`
      <SidenotesWrapper
        @items={{this.items}}
        @onSelect={{this.onSelect}}
        @onUnselect={{this.onUnselect}}
        as |Sidenote item|
      >
        <Sidenote
          data-sidenote-id={{item.id}}
          @id={{item.id}}
          @offsetY={{item.y}}
          @data={{item.data}}
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
      </SidenotesWrapper>
    `);

    assert.dom('[data-sidenote-id="1"]').hasStyle({
      top: `${this.items[0].y}px`,
    });

    await click('[data-sidenote-id="3"] [data-select-button]');
    await waitUntil(() => this.onSelectCalled);
    this.set('onSelectCalled', false);

    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${this.items[2].y}px`,
    });

    await click('[data-sidenote-id="3"] [data-unselect-button]');
    await waitUntil(() => this.onUnselectCalled);
    this.set('onUnselectCalled', false);

    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${this.items[2].y}px`,
    });
  });

  test('it works in controlled mode', async function (assert) {
    this.set('selectedSidenoteId', null);

    this.set('onSelectCalled', false);
    this.set('onSelect', ({ id }) => {
      this.setProperties({
        selectedSidenoteId: id,
        onSelectCalled: true,
      });
    });

    this.set('onUnselectCalled', false);
    this.set('onUnselect', () => {
      this.setProperties({
        selectedSidenoteId: null,
        onUnselectCalled: true,
      });
    });

    await render(hbs`
      <SidenotesWrapper
        @selectedSidenoteId={{this.selectedSidenoteId}}
        @items={{this.items}}
        @onSelect={{this.onSelect}}
        @onUnselect={{this.onUnselect}}
        as |Sidenote item|
      >
        <Sidenote
        data-sidenote-id={{item.id}}
          @id={{item.id}}
          @offsetY={{item.y}}
          @data={{item.data}}
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
      </SidenotesWrapper>
    `);

    assert.dom('[data-sidenote-id="1"]').hasStyle({
      top: `${this.items[0].y}px`,
    });

    assert.dom('[data-sidenote-id="5"]').hasStyle({
      top: `${this.items[4].y}px`,
    });

    await click('[data-sidenote-id="3"] [data-select-button]');
    await waitUntil(() => this.onSelectCalled);
    this.set('onSelectCalled', false);

    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${this.items[2].y}px`,
    });

    await click('[data-sidenote-id="3"] [data-unselect-button]');
    await waitUntil(() => this.onUnselectCalled);
    this.set('onUnselectCalled', false);

    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${this.items[2].y}px`,
    });
  });

  test('it triggers placement on resize', async function (assert) {
    const elementHeight = 100;

    this.set('onSidenotesMovedCalled', false);
    this.set('onSidenotesMoved', () => {
      this.set('onSidenotesMovedCalled', true);
    });

    this.set('showMore', false);
    this.set('activeStyle', htmlSafe(`height: ${elementHeight}px;`));

    await render(hbs`
      <SidenotesWrapper
        @items={{this.items}}
        @onSidenotesMoved={{this.onSidenotesMoved}}
        as |Sidenote item|
      >
        <Sidenote
          data-sidenote-id={{item.id}}
          style={{if this.showMore this.activeStyle}}
          @id={{item.id}}
          @offsetY={{item.y}}
          @data={{item.data}}
        />
      </SidenotesWrapper>
    `);

    await waitUntil(() => this.onSidenotesMovedCalled);
    this.set('onSidenotesMovedCalled', false);
    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${this.items[2].y}px`,
    });

    this.set('showMore', true);

    await waitUntil(() => this.onSidenotesMovedCalled);
    this.set('onSidenotesMovedCalled', false);
    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${this.items[1].y + elementHeight}px`,
    });
  });

  test('it triggers placement on items change', async function (assert) {
    this.set('onSidenotesMovedCalled', false);
    this.set('onSidenotesMoved', () => {
      this.set('onSidenotesMovedCalled', true);
    });

    this.set('style', htmlSafe(`height: 100px;`));

    await render(hbs`
      <SidenotesWrapper
        @items={{this.items}}
        @onSidenotesMoved={{this.onSidenotesMoved}}
        as |Sidenote item|
      >
        <Sidenote
          data-sidenote-id={{item.id}}
          style={{this.style}}
          @id={{item.id}}
          @offsetY={{item.y}}
          @data={{item.data}}
        />
      </SidenotesWrapper>
    `);

    await waitUntil(() => this.onSidenotesMovedCalled);
    this.set('onSidenotesMovedCalled', false);

    const element = this.items[2];

    assert.dom('[data-sidenote-id="3"]').doesNotHaveStyle({
      top: `${element.y}px`,
    });

    this.set(
      'items',
      this.items.filter(({ id }) => id !== 2)
    );

    await waitUntil(() => this.onSidenotesMovedCalled);
    this.set('onSidenotesMovedCalled', false);
    assert.dom('[data-sidenote-id="3"]').hasStyle({
      top: `${element.y}px`,
    });
  });

  test('it replaces sidenote with same id', async function (assert) {
    await render(hbs`
      <SidenotesWrapper
        @items={{this.items}}
        as |Sidenote item|
      >
        <Sidenote
          data-sidenote-id={{item.id}}
          @id={{item.id}}
          @offsetY={{item.y}}
          @data={{item.data}}
        >
          Dummy text
        </Sidenote>
      </SidenotesWrapper>
    `);

    const { id } = this.items[0];

    assert.dom(`[data-sidenote-id="${id}"]`).exists({ count: 1 });

    this.set('items', [
      ...this.items.filter(({ id: itemId }) => itemId !== id),
      { id, y: 100, data: null },
    ]);

    assert.dom(`[data-sidenote-id="${id}"]`).exists({ count: 1 });
  });

  test('it keeps @items order among notes', async function (assert) {
    this.set('items', [
      { id: 1, y: 300 },
      { id: 2, y: 120 },
    ]);

    await render(hbs`
      <SidenotesWrapper
        @items={{this.items}}
        as |Sidenote item|
      >
        <Sidenote
          data-sidenote
          @id={{item.id}}
          @offsetY={{item.y}}
        >
          Dummy text
        </Sidenote>
      </SidenotesWrapper>
    `);

    const sidenotes = document.querySelectorAll('[data-sidenote]');
    assert.ok(sidenotes[0].offsetTop < sidenotes[1].offsetTop);
  });
});
