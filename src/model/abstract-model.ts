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
}
