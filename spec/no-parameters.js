'use strict';

let sampleFile = `namespace Service.Filters.People
{
    public class ByNameAndAgeFilter : IFilter<Dmn.Person, Permissions>
    {
        private readonly string name;
        private readonly int age;

        public ByNameAndAgeFilter(string name, int age)
        {
            this.name = name;
            this.age = age;
        }

        public HttpStatusCode HasPermissions(Permissions permissions)
        {
            return HttpStatusCode.OK;
        }

        public IQueryable<Dmn.Person> Apply(IQueryable<Dmn.Person> query)
        {
            return query.Where(dmn => dmn.Name == this.name && dmn.Age == this.age);
        }
    }
}`;

let expectedOutput = `module app {
    'use strict';

    export class PeopleByNameAndAgeFilter implements IFilter<Person> {
        constructor(private name: string, private age: number) {
        }

        public getFilterName(): string {
            return 'ByNameAndAge';
        }

        public getParameters(): string[] {
            return [this.name, this.age];
        }
    }
}`;

let typeScriptFilterGenerator = require('../index.js');

describe('typescript-filter-generator', function() {
    it('should transform a filter correctly', function() {
        let options = { module: 'app' };
        let result = typeScriptFilterGenerator(sampleFile, options);
        expect(result).toEqual(expectedOutput);
    });
});
