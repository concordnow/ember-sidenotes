import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SidenoteComponent extends Component {
  element = null;

  get isActive() {
    const { selectedSidenoteId, id } = this.args;
    return selectedSidenoteId === id;
  }

  @action
  onDidInsert(element, [id, offsetY, data]) {
    this.element = element;

    this.args.onRegister({ element, id, offsetY, data });
  }
}
