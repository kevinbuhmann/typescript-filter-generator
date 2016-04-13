'use strict';

let sampleFile = `namespace AntiqueMallsServices.AntiqueMalls.Filters.Mall
{
    public class ByPostalCodeIdAndPhoneNumber
        : IPrimaryRestFilter<Dmn.Mall, MallMapper, Permissions>
    {
        protected readonly int postalCodeId;
        protected readonly string phoneNumber;

        public ByPostalCodeIdAndPhoneNumber(int postalCodeId, string phoneNumber)
        {
            this.postalCodeId = postalCodeId;
            this.phoneNumber = phoneNumber;
        }

        public RestStatus HasPrimaryPermissions(Permissions permissions, DeletedState deletedState)
        {
            return RestStatus.Ok;
        }

        public IQueryable<Dmn.Mall> PrimaryFilter(MallMapper mapper, DeletedState deletedState)
        {
            return something;
        }
    }
}`;

let expectedOutput = `module app {
    'use strict';

    export class MallsByPostalCodeIdAndPhoneNumberFilter implements IFilter<Mall> {
        constructor(private postalCodeId: number, private phoneNumber: string) {
        }

        public getFilterName(): string {
            return 'ByPostalCodeIdAndPhoneNumber';
        }

        public getParameters(): string[] {
            return [this.postalCodeId, this.phoneNumber];
        }
    }
}`;

let typeScriptFilterGenerator = require('../index.js');

describe('typescript-filter-generator', function() {
    it('should transform a Vintage Software filter correctly', function() {
        let options = { module: 'app' };
        let result = typeScriptFilterGenerator(sampleFile, options);
        expect(result).toEqual(expectedOutput);
    });
});
