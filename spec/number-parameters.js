'use strict';

let sampleFile = `namespace Service.Filters.People
{
    public class ByHeightAndAgeFilter : IFilter<Dmn.Person, Permissions>
    {
        private readonly int height;
        private readonly int age;

        public ByHeightAndAgeFilter(int height, int age)
        {
            this.height = height;
            this.age = age;
        }

        public HttpStatusCode HasPermissions(Permissions permissions)
        {
            return HttpStatusCode.OK;
        }

        public IQueryable<Dmn.Person> Apply(IQueryable<Dmn.Person> query)
        {
            return query.Where(dmn => dmn.Height == this.height && dmn.Age == this.age);
        }
    }
}`;

let expectedOutput = `module app {
    'use strict';

    export class PeopleByHeightAndAgeFilter implements IFilter<Person> {
        constructor(private height: number, private age: number) {
        }

        public getFilterName(): string {
            return 'ByHeightAndAge';
        }

        public getParameters(): string[] {
            return [this.height.toString(), this.age.toString()];
        }
    }
}`;

let typeScriptFilterGenerator = require('../index.js');

describe('typescript-filter-generator', function() {
    it('should transform a filter with number parameters correctly', function() {
        let options = { module: 'app' };
        let result = typeScriptFilterGenerator(sampleFile, options);
        expect(result).toEqual(expectedOutput);
    });
});
