# [@superjs](https://www.npmjs.com/org/superjs)/cb
awaitable callback. 

async/await way to call callback style functions

## Thought
If you want to convert callback style to async/await style, you can either:
1. wrap the operation to return a new Promise, which is ugly
2. or, just call the operation, using @superjs/cb as callback, then await the cb  

## Example

```javascript
const Cb = require('@superjs/cb')
// await can't be used without being wrapped by async function
;(async ()=>{
  // Cb() create a plain Promise
  // with some extra fields/magics
  setTimeout(Cb().ok,2000)

  await Cb.pop()
})()
```

You can also use it as event handlers:
```javascript
const Cb = require('@superjs/cb')
const {spawn} = require('child_process')
// await can't be used without being wrapped by async function
;(async ()=>{
  let proc = spawn('ls')
  // Cb().ok resolve 1st arg
  proc.stdout.on('data', Cb().ok) 
  // use Cb instead of Cb() to reference the last created one
  proc.on('error', Cb.err) //Cb.err reject 1st arg
  try {
    let out = await Cb.pop()
    console.log(`out: `+ out)
  }
  catch (err) {
    console.log(`err: `, err)
  }
})()
```

## API
### `Cb()`

* `returns`: `Cb`, return itself 

calling `Cb` will create a `Promise`: `cb`, then push `cb` to `cbStack`. 
From now on, `Cb` will *ref* to the `cb` created

**__*ref* means you can use `Cb.ok/err/arr/pair` to get `cb.ok/err/arr/pair`__**

### `Cb.pop()`
 
 * `returns`: `cb`, a `Promise` 
 
Pop the top `cb` in `cbStack` and return it

### `Cb.new()`
 
 * `returns`: `cb`, a `Promise` 
 
return a standalone cb not included by `cbStack`

comparing to `Cb()/Cb.pop()`, you would have to add a local variable to reference to `Cb.new()`

### `cb.then/catch/finally`

since cb is a `Promise`, use them just like `new Promise(...).then/catch/finally`



### `cb.ok(value)`

* `value`: value to be resolved with
 
resolve the Promise `cb` with `value`

### `cb.err(err)`

* `err`: error to be rejected with
 
reject the Promise `cb` with `err`

### `cb.arr(...args)`

* `...args`: arg list to be resolved with

collect args received as an array and resolve with `args`

### `cb.pair(err, value)`

* `err`: error to be rejected with, `err==null` to resolve `value`

* `value`: value to be resolved with, if `err==null`
 
## Use together with [@superjs/wait](https://www.npmjs.com/package/@superjs/wait)

@superjs/wait can await something synchronously. 

```javascript
const Cb = require('@superjs/cb')
const wait = require('@superjs/wait')

foo(1,2,Cb().arr) 
// wait instead of await
let result = wait(Cb.pop()) 
// print [3,-1] one second later
console.log(result) 

function foo(a,b,cb){
  setTimeout(()=>cb(a+b,a-b),1000)
}
```

## Compatibility
You can use @superjs/cb in both nodejs and browser environment.
