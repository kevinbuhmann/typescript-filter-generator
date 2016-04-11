#typescript-filter-generator

[![Build Status](https://api.travis-ci.org/kevinphelps/typescript-filter-generator.png)](https://travis-ci.org/kevinphelps/typescript-filter-generator)

This is specific tool for a private/company project.

The generated Typescript classes implement the `IFilter<TEntity>` interface:

```typescript
export interface IFilter<TEntity> {
    getFilterName(): string;
    getParameters(): string[];
}
```

Gulp wrapper: https://github.com/kevinphelps/gulp-typescript-filter-generator/
