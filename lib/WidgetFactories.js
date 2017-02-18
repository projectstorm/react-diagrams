/**
 * @author Dylan Vorster
 */
export class WidgetFactory {
    constructor(name) {
        this.type = name;
    }
    getType() {
        return this.type;
    }
}
export class NodeWidgetFactory extends WidgetFactory {
}
export class LinkWidgetFactory extends WidgetFactory {
}
