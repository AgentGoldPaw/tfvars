# tfvars

javascript / typescript library for programatically producing tfvars file

## install

```shell
npm i @RedMunroe/tfvars
```

## import

```js
import tfvars from '@RedMunroe/tfvars';
```

## usage

```js
new TFVars()
  .addString('name', 'test')
  .addNumber('age', 12)
  .addBoolean('isTrue', true)
  .addMap(
    'map',
    new Map().set('name', 'test').set('age', 12).set('isTrue', true),
  )
  .addList('list', [
    {
      name: 'test',
    },
  ])
  .stdout();
```

```shell
name = "test"
age = 12
isTrue = true
map = object({
   name = "test"
   age = 12
   isTrue = true
})
list = [
object({
   name = "test"
})
]
```
