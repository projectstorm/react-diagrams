export declare class Toolkit {
    static TESTING: boolean;
    static TESTING_UID: number;
    /**
     * Generats a unique ID (thanks Stack overflow :3)
     * @returns {String}
     */
    static UID(): string;
    /**
     * Finds the closest element as a polyfill
     */
    static closest(element: Element, selector: string): any;
}
