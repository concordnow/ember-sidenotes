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
    assert.equal(placementNote1.top, notes[0].offsetY);
    assert.equal(placementNote2.top, notes[1].offsetY);
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
    assert.equal(placementNote2.top, notes[1].offsetY);
    assert.equal(
      placementNote1.top,
      placementNote2.top - notes[0].element.offsetHeight
    );
    assert.equal(
      placementNote3.top,
      placementNote2.top + notes[1].element.offsetHeight
    );
    assert.equal(placementNote4.top, notes[3].offsetY);
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
    assert.equal(placementNote2.top, notes[1].offsetY);
    assert.equal(
      placementNote1.top,
      placementNote2.top - notes[0].element.offsetHeight - gutter
    );
    assert.equal(
      placementNote3.top,
      placementNote2.top + notes[1].element.offsetHeight + gutter
    );
    assert.equal(placementNote4.top, notes[3].offsetY);
  });
});
