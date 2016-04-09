'use strict';

let sampleFile = `namespace Service.Filters.People
{
    public class ByNameAndAgesFilter : IFilter<Dmn.Person, Permissions>
    {
        private readonly string name;
        private readonly int[] ages;

        public ByNameFilter(string name, int[] ages)
        {
            this.name = name;
            this.ages = ages;
        }

        public HttpStatusCode HasPermissions(Permissions permissions)
        {
            return HttpStatusCode.OK;
        }

        public IQueryable<Dmn.Person> Apply(IQueryable<Dmn.Person> query)
        {
            return query.Where(dmn => dmn.Name == this.name && this.ages.Contains(dmn.Age));
        }
    }
}`;

let expectedOutput = `module app {
    'use strict';

    export interface IFilter<T> {
        getFilterName(): string;
        getParameters(): string[];
    }

    export class PeopleByNameAndAgesFilter implements IFilter<Person> {
        constructor(private name: string, private ages: number[]) {
        }

        public getFilterName(): string {
            return 'ByNameAndAges';
        }

        public getParameters(): string[] {
            return [this.name, this.ages.join(',')];
        }
    }
}`;

let typeScriptFilterGenerator = require('../index.js');

describe('typescript-filter-generator', function() {
    it('should transform a filter with array parameters correctly', function() {
        let options = { module: 'app' };
        let result = typeScriptFilterGenerator(sampleFile, options);
        expect(result).toEqual(expectedOutput);
    });
});
