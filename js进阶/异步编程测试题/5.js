// function* gen() {
//   var a = yield "a";
//   var b = yield a + "b";
//   return b;
// }
// var g = gen();

// console.log(g.next());
// console.log(g.next("c"));
// console.log(g.next());



// function* gen1() {
//   yield "a";
//   yield "b";
// }

// function* gen2() {
//   yield* gen1();
//   yield "c";
//   yield "d";
// }

// function* gen3() {
//   gen1();
//   yield "c";
//   yield "d";
// }

// const g2 = gen2();
// const g3 = gen3();
// for (let v of g2) {
//   console.log(v);
// }
// for (let v of g3) {
//   console.log(v);
// }


function geneP(d1, d2) {
  return new Promise(function (resolve, reject) {
    if (+new Date() > 0) {
      resolve(d1);
    } else {
      reject(d2);
    }
  });
}
function* gen() {
  yield geneP("yes", "no");
  yield geneP("y", "n");
}

function run(fn) {
  var g = fn();
  function next() {
    var result = g.next();
    console.log(result.value);
    if (result.done) return;
    result.value.then(next);
  }
  next();
}

run(gen);