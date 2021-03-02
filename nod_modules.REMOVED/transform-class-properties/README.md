# transform-class-properties

Automatically transforms values of class properties.

## Prerequisites

- [TypeScript](https://www.typescriptlang.org/) **>= 1.5**

- Enable the **experimentalDecorators** in `tsconfig.json`.

> Note: **ES5** is min target minimun to build.

## Installation

```sh
npm install transform-class-properties --save
```

or

```sh
yarn add transform-class-properties
```

## Usage

```ts
import {
  Float,
  RemoveNonNumeric,
  ToUpperCase,
  transform,
  Trim
} from 'transform-class-properties';

class Book {
  @ToUpperCase()
  @Trim()
  public title: string;

  @Float(2)
  public price: number;

  @RemoveNonNumeric()
  public issn: string;
}

const book1 = new Book();
book1.title = '    My first book    ';
book1.price = 12.3210;
book1.issn = '1234-5679'

console.log(transform(book1)); // Book { title: 'MY FIRST BOOK', price: 12.32, issn: '12345679' }
```

## Decorators

| Decorator                                                     | Description                                         | Class property type |
|---------------------------------------------------------------|-----------------------------------------------------|---------------------|
| @Append(additionalValue: string \| number)                    | Adds value at the end.                              | string              |
| @Capitalize()                                                 | Capitalize the first letter and lowercase the rest. | string              |
| @Float(fractionDigits?: number)                               | Converts number to float.                           | number              |
| @Integer()                                                    | Converts number to integer.                         | number              |
| @Prepend(additionalValue: string \| number)                   | Adds value at the beginning.                        | string              |
| @Regex(expression: RegExp)                                    | Returns matched value with regular expression.      | string              |
| @RemoveNonNumeric()                                           | Removes anything non-numeric character.             | string              |
| @RemoveNumeric()                                              | Removes numeric characters.                         | string              |
| @Replace(searchValue: string \| RegExp, replaceValue: string) | Find and replace value.                             | string              |
| @ToLowerCase()                                                | Lower case characters.                              | string              |
| @ToUpperCase()                                                | Upper case characters.                              | string              |
| @Trim()                                                       | Trim characters.                                    | string              |

## License

[MIT](https://choosealicense.com/licenses/mit)
