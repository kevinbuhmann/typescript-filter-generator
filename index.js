'use strict';

let typeTranslation = {};
typeTranslation.int = 'number';
typeTranslation.double = 'number';
typeTranslation.float = 'number';
typeTranslation.Int32 = 'number';
typeTranslation.Int64 = 'number';
typeTranslation.short = 'number';
typeTranslation.long = 'number';
typeTranslation.decimal = 'number';
typeTranslation.bool = 'boolean';
typeTranslation.DateTime = 'string';
typeTranslation.Guid = 'string';
typeTranslation.JObject = 'any';
typeTranslation.string = 'string';
typeTranslation.dynamic = 'any';

module.exports = function(input, options) {
    let module = options && options.module;

    let namespace, filterName, filterType, constructor;

    let namespaceMatch = input.match(new RegExp('namespace\\s+(.+)\\s+{'));
    if (namespaceMatch) {
        let parts = namespaceMatch[1].split('.');
        namespace = parts[parts.length - 1];
    }

    let filterNameMatch = input.match(new RegExp(`class\\s+(.+)Filter\\s+:`));
    if (filterNameMatch) {
        filterName = filterNameMatch[1];
    }

    let filterTypeMatch = input.match(new RegExp(`Dmn\\.(.+),`));
    if (filterTypeMatch) {
        filterType = filterTypeMatch[1];
    }

    let constructorMatch = input.match(new RegExp(`public\\s+${filterName}Filter\\((.+)\\)`));
    if (constructorMatch) {
        constructor = constructorMatch[1];
    }

    let tsConstructorParams = [], filterParams = [];
    let constructorParams = constructor.split(',');
    for (let i = 0; i < constructorParams.length; i++) {
        let paramParts = constructorParams[i].trim().split(' ');
        let paramType = paramParts[0];
        let paramName = paramParts[1];

        let isArray = paramType.endsWith('[]');
        if (isArray) { paramType = paramType.replace('[]', ''); }

        let tsType = typeTranslation[paramType];
        if (isArray) { tsType += '[]'; }

        let filterParam = `this.${paramName}`;
        if (isArray) { filterParam += `.join(',')`; }

        tsConstructorParams.push(`private ${paramName}: ${tsType}`);
        filterParams.push(filterParam);
    }

    let result = '';
    let indent = module ? '    ' : '';

    if (module) { result += `module ${module} {\n` }

    result += `${indent}'use strict';\n\n`;

    result += `${indent}export class ${namespace}${filterName}Filter implements IFilter<${filterType}> {\n`;
    result += `${indent}    constructor(${tsConstructorParams.join(', ')}) {\n`
    result += `${indent}    }\n\n`;

    result += `${indent}    public getFilterName(): string {\n`;
    result += `${indent}        return '${filterName}';\n`;
    result += `${indent}    }\n\n`;

    result += `${indent}    public getParameters(): string[] {\n`;
    result += `${indent}        return [${filterParams.join(', ')}];\n`;
    result += `${indent}    }\n`;
    result += `${indent}}\n`;

    if (module) { result += `}` }

    return result;
};
