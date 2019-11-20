type ConvertConfig = Map<Function, Function>;

export function jsonStringToObject(jsonParsedObject: any, config: ConvertConfig) {
    if (typeof jsonParsedObject === "string") {
        for (let [key, value] of config) {
            if (key(jsonParsedObject)) {
                return value(jsonParsedObject);
            }
        }
        return jsonParsedObject;
    } else if (typeof jsonParsedObject === "object") {
        for (let [key, value] of config) {
            if (key(jsonParsedObject)) {
                return value(jsonParsedObject);
            }
        }
        if (jsonParsedObject instanceof Array) {
            return jsonParsedObject.map(it => jsonStringToObject(it, config));
        } else if (jsonParsedObject instanceof Object) {
            let result = {};
            for (let attr in jsonParsedObject) {
                if (jsonParsedObject.hasOwnProperty(attr)) {
                    (result as any)[attr] = jsonStringToObject(jsonParsedObject[attr], config);
                }
            }
            return result;
        }
    } else {
        return jsonParsedObject;
    }
    throw new Error(`Should never reach here!`);
}
