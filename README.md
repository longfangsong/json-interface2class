# json-interface2class
A library to help casting interface-like objects in parsed json into class-like object

## How to use

```typescript
const dateRegex = /((\d{4})|([+-]?\d{6}))-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

// here's a json string
let before = `{"date":"2019-11-20T17:07:39.383Z"}`;
// here's a convert config
let config = new Map<Function, Function>();
// convert anything which matches the dateRegex into a js Date object
config.set(dateRegex.test.bind(dateRegex), (str: string) => new Date(str));
// convert the JSON.parse result
let after: { date: Date } = jsonStringToObject(JSON.parse(before), config);
expect(after.date.getFullYear()).eq(2019); // true
```

We also support complex object:

```typescript
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
```
