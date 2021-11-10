import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SidenoteComponent extends Component {
  element = null;

  get isActive() {
    const { selectedSidenoteId, id } = this.args;
    return selectedSidenoteId === id;
  }

  @action
  onDidInsert(element) {
    this.element = element;

    const { id, offsetY, data } = this.args;
    this.args.onRegister({ element, id, offsetY, data });
  }
}
