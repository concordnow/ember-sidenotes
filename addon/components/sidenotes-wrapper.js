import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

import { getNotesIdealPlacement } from '../utils/notes-placement';

export default class SidenotesWrapperComponent extends Component {
  @tracked _selectedSidenoteId = null;
  @tracked _alignedSidenoteId = null;

  @tracked notes = [];

  get gutter() {
    return this.args.gutter ?? 0;
  }

  get controlledMode() {
    return this.args.selectedSidenoteId !== undefined;
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
    });

    this.args.onSidenotesMoved?.();
  }

  @action
  onRegisterSidenote(note) {
    this.notes = [...this.notes, note];

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
  onResizeSidenote() {
    this.placeNotesDebounce();
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
}
