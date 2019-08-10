import { E2EBase } from './E2EBase';
import { E2EPort } from './E2EPort';

export class E2ENode extends E2EBase {
	async port(id: string): Promise<E2EPort> {
		return new E2EPort(id, this);
	}

	selector(): string {
		return `[data-default-node-name="${this.name}"]`;
	}
}
