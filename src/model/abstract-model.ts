import {snakeCaseToCamelCase} from "../utils";

export class AbstractModel {
    public static fromObject<T extends object>(object: object, constructor: (new () => T)): T {
        const toBuild = new constructor();
        for (const key in object) {
            if (object.hasOwnProperty(key) && toBuild.hasOwnProperty(key)) {
                toBuild[key] = object[key]
            }
        }
        return toBuild;
    }

    public static fromDB<T extends object>(object: object, constructor: (new () => T)): T {
        const toBuild = new constructor();
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const camelCaseKey = snakeCaseToCamelCase(key.toLowerCase());
                if (toBuild.hasOwnProperty(camelCaseKey)) {
                    toBuild[camelCaseKey] = object[key];
                }
            }
        }
        return toBuild;
    }
}
