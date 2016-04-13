'use strict';

let pluralize = require('pluralize');

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
    if (input.indexOf('ts-filter-ignore') !== -1) {
        return '';
    }

    let module = options && options.module;

    let namespace, filterClassName, filterName, filterType, constructor;

    let namespaceMatch = input.match(new RegExp('namespace\\s+(.+)\\s+{'));
    if (namespaceMatch) {
        let parts = namespaceMatch[1].split('.');
        namespace = parts[parts.length - 1];
    }

    let filterClassNameMatch = input.match(new RegExp(`class\\s+(.+)\\s+:`));
    if (filterClassNameMatch) {
        filterClassName = filterClassNameMatch[1].endsWith('Filter') ?
          filterClassNameMatch[1] : `${filterClassNameMatch[1]}Filter`;
        filterName = filterClassName.replace('Filter', '');
    }

    let filterTypeMatch = input.match(new RegExp(`Dmn\\.(\\w+),`));
    if (filterTypeMatch) {
        filterType = filterTypeMatch[1];
    }

    let constructorMatch = input.match(new RegExp(`public\\s+${filterName}(?:Filter)?\\((.+)\\)`));
    if (constructorMatch) {
        constructor = constructorMatch[1];
    }

    let tsConstructorParams = [], filterParams = [];
    if (constructor) {
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
            else if (tsType != 'string') { filterParam += `.toString()`; }

            tsConstructorParams.push(`private ${paramName}: ${tsType}`);
            filterParams.push(filterParam);
        }
    }

    let result = '';
    let indent = module ? '    ' : '';

    if (module) { result += `module ${module} {\n` }

    result += `${indent}'use strict';\n\n`;

    result += `${indent}export class ${pluralize(namespace)}${filterClassName} implements IFilter<${filterType}> {\n`;
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
