import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

import { getNotesIdealPlacement } from '../utils/notes-placement';

export default class SidenotesWrapperComponent extends Component {
  @tracked _selectedSidenoteId = null;
  _alignedSidenoteId = null;

  notes = [];

  get gutter() {
    return this.args.gutter ?? 0;
  }

  get controlledMode() {
    return this.args.selectedSidenoteId !== undefined;
  }

  get key() {
    return this.args.key ?? '@identity';
  }

  constructor() {
    super(...arguments);

    this._selectedSidenoteId = this._alignedSidenoteId = this.controlledMode
      ? this.args.selectedSidenoteId
      : this.args.defaultSidenoteId ?? null;
  }

  placeNotesDebounce() {
    debounce(this, this.placeNotes, 0);
  }

  placeNotes() {
    const idealPlacement = getNotesIdealPlacement(
      this.notes,
      this._alignedSidenoteId,
      this.gutter
    );

    idealPlacement.forEach(({ top, note: { element } }) => {
      element.style.top = `${top}px`;
      element.dataset.ready = true;
    });

    this.args.onSidenotesMoved?.();
  }

  @action
  onRegisterSidenote(item, note) {
    note.item = item;

    const index = this.notes.findIndex(({ id }) => id === note.id);

    let notes = [...this.notes];
    if (index > -1) {
      notes[index] = note;
    } else {
      notes.splice(this.indexOfItem(this.args.items, item), 0, note);
    }

    this.notes = notes;

    if (this.notes.length === this.args.items.length) {
      this.placeNotesDebounce();
    }
  }

  @action
  onSelectedSidenoteIdUpdate() {
    const { selectedSidenoteId } = this.args;

    this._selectedSidenoteId = selectedSidenoteId;
    if (selectedSidenoteId) {
      this._alignedSidenoteId = selectedSidenoteId;
    }
    this.placeNotesDebounce();
  }

  @action
  onItemsDidChange() {
    this.notes = this.notes.filter(
      ({ item }) => this.indexOfItem(this.args.items, item) > -1
    );

    this.placeNotesDebounce();
  }

  @action
  onResizeSidenote(id) {
    const { item } = this.notes.find(({ id: noteId }) => id === noteId);
    if (this.indexOfItem(this.args.items, item) > -1) {
      this.placeNotesDebounce();
    }
  }

  @action
  onSelectSidenote({ id }) {
    this._selectedSidenoteId = this._alignedSidenoteId = this.controlledMode
      ? this.args.selectedSidenoteId
      : id;

    if (!this.controlledMode) {
      this.placeNotesDebounce();
    }

    this.args.onSelect?.(...arguments);
  }

  @action
  onUnselectSidenote() {
    if (!this.controlledMode) {
      this._selectedSidenoteId = null;
    }
    this.args.onUnselect?.(...arguments);
  }

  indexOfItem(array, obj) {
    return array.findIndex((item) => this.areItemsEqual(item, obj));
  }

  areItemsEqual(obj1, obj2) {
    const { key } = this.args;
    return key ? obj1[key] === obj2[key] : obj1 === obj2;
  }
}
