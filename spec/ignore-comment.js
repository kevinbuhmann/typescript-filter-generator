'use strict';

let sampleFile = `namespace Service.Filters.People
{
    // ts-filter-ignore
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

let expectedOutput = ``;

let typeScriptFilterGenerator = require('../index.js');

describe('typescript-filter-generator', function() {
    it('should ignore a filter correctly', function() {
        let options = { module: 'app' };
        let result = typeScriptFilterGenerator(sampleFile, options);
        expect(result).toEqual(expectedOutput);
    });
});
