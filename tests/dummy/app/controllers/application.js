import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  @tracked items = [];

  @action
  onDidInsert() {
    document.querySelectorAll('#text-container span').forEach((node) => {
      this.items = [
        ...this.items,
        {
          id: this.items.length,
          y: node.offsetTop,
          data: { content: node.textContent },
        },
      ];
    });
  }
}
