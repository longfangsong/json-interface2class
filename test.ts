import 'mocha';
import {jsonStringToObject} from "./index";
import {expect} from 'chai';

class DumbClass {
    constructor(public readonly name: string, public readonly date: Date) {
    }

    static from(init: { name: string, date: string }) {
        return new DumbClass(init.name, new Date(init.date));
    }

    get describe() {
        return this.name + '-' + this.date.getFullYear();
    }
}

const dateRegex = /((\d{4})|([+-]?\d{6}))-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
describe('unit test', function () {
    it('can convert raw string', () => {
        let before = `{"date":"2019-11-20T17:07:39.383Z"}`;
        let config = new Map<Function, Function>();
        config.set(dateRegex.test.bind(dateRegex), (str: string) => new Date(str));
        let after: { date: Date } = jsonStringToObject(JSON.parse(before), config);
        expect(after.date.getFullYear()).eq(2019);
    });
    it('can convert string in a deep object', () => {
        let before = `{
            "date": "2019-11-20T17:07:39.383Z", 
            "a": {
                "b": {
                    "deepHidden": "2019-11-20T17:07:39.383Z"
                }
            }
            }`;
        let config = new Map<Function, Function>();
        config.set(dateRegex.test.bind(dateRegex), (str: string) => new Date(str));
        let after: { a: { b: { deepHidden: Date } } } = jsonStringToObject(JSON.parse(before), config);
        expect(after.a.b.deepHidden.getFullYear()).eq(2019);
    });
    it('can convert data object into class object', () => {
        let before = `{
            "date": "2019-11-20T17:07:39.383Z", 
            "a": {
                "name": "abc",
                "date": "2019-11-20T17:07:39.383Z"
            }
          }`;
        let config = new Map<Function, Function>();
        config.set((obj: any) => typeof obj == "object" && obj.hasOwnProperty("name") && obj.hasOwnProperty("date"), DumbClass.from);
        let after: { a: DumbClass } = jsonStringToObject(JSON.parse(before), config);
        expect(after.a.describe).eq("abc-2019");
    });
});
