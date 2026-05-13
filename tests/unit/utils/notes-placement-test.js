import { module, test } from 'qunit';
import { getNotesIdealPlacement } from 'ember-sidenotes/utils/notes-placement';

module('Unit | Utility | notes-placement', function () {
  test('it positions notes at offsetY when no collision', function (assert) {
    const notes = [
      { id: 1, offsetY: 0, element: { offsetHeight: 100 } },
      { id: 2, offsetY: 300, element: { offsetHeight: 100 } },
    ];

    const idealPlacement = getNotesIdealPlacement(notes, 1, 0);
    const [placementNote1, placementNote2] = idealPlacement;
    assert.strictEqual(placementNote1.top, notes[0].offsetY);
    assert.strictEqual(placementNote2.top, notes[1].offsetY);
  });

  test('it positions notes below each other when there are some collisions', function (assert) {
    const notes = [
      { id: 1, offsetY: 40, element: { offsetHeight: 80 } },
      { id: 2, offsetY: 50, element: { offsetHeight: 60 } },
      { id: 3, offsetY: 60, element: { offsetHeight: 50 } },
      { id: 4, offsetY: 200, element: { offsetHeight: 50 } },
    ];

    const idealPlacement = getNotesIdealPlacement(notes, 2, 0);
    const [placementNote1, placementNote2, placementNote3, placementNote4] =
      idealPlacement;
    assert.strictEqual(placementNote2.top, notes[1].offsetY);
    assert.strictEqual(
      placementNote1.top,
      placementNote2.top - notes[0].element.offsetHeight,
    );
    assert.strictEqual(
      placementNote3.top,
      placementNote2.top + notes[1].element.offsetHeight,
    );
    assert.strictEqual(placementNote4.top, notes[3].offsetY);
  });

  test('it positions notes below each other with gutter when there are some collisions', function (assert) {
    const notes = [
      { id: 1, offsetY: 40, element: { offsetHeight: 80 } },
      { id: 2, offsetY: 50, element: { offsetHeight: 60 } },
      { id: 3, offsetY: 60, element: { offsetHeight: 50 } },
      { id: 4, offsetY: 200, element: { offsetHeight: 50 } },
    ];
    const gutter = 10;

    const idealPlacement = getNotesIdealPlacement(notes, 2, gutter);
    const [placementNote1, placementNote2, placementNote3, placementNote4] =
      idealPlacement;
    assert.strictEqual(placementNote2.top, notes[1].offsetY);
    assert.strictEqual(
      placementNote1.top,
      placementNote2.top - notes[0].element.offsetHeight - gutter,
    );
    assert.strictEqual(
      placementNote3.top,
      placementNote2.top + notes[1].element.offsetHeight + gutter,
    );
    assert.strictEqual(placementNote4.top, notes[3].offsetY);
  });

  test('it falls back to first note when activeNoteId is not found', function (assert) {
    const notes = [
      { id: 1, offsetY: 100, element: { offsetHeight: 50 } },
      { id: 2, offsetY: 300, element: { offsetHeight: 50 } },
    ];

    const idealPlacement = getNotesIdealPlacement(notes, 999, 0);
    const [placementNote1, placementNote2] = idealPlacement;

    assert.strictEqual(
      placementNote1.top,
      notes[0].offsetY,
      'first note keeps its offsetY when used as fallback anchor',
    );
    assert.strictEqual(
      placementNote2.top,
      notes[1].offsetY,
      'second note keeps its offsetY (no collision)',
    );
  });

  // `getNotesIdealPlacement` uses `top || offsetY` which short-circuits on 0.
  // This test pins the current behavior (passes by coincidence — keep as regression net).
  test('it preserves offsetY = 0 for a single note (current behavior)', function (assert) {
    const notes = [{ id: 1, offsetY: 0, element: { offsetHeight: 50 } }];

    const idealPlacement = getNotesIdealPlacement(notes, 1, 0);
    const [placementNote1] = idealPlacement;

    assert.strictEqual(
      placementNote1.top,
      0,
      'single note with offsetY=0 is placed at top=0',
    );
  });
});
