// Promise.resolve({
//   then: function () {
//     console.log("a");
//   },
// }).then(() => {
//   console.log("d");
// });


// Promise.resolve({
//   then: function (fullfill) {
//     fullfill("a");
//     console.log("b");
//     throw new Error("c");
//     console.log("d");
//   },
// }).then(
//   (d) => {
//     console.log(d);
//   },
//   (err) => {
//     console.log(err.message);
//   }
// )
// .catch(err=>{
//   console.log(err.message);
// })


// Promise.resolve(3)
//   .then(() => {
//     console.log("a");
//     throw new Error("b");
//   })
//   .then(
//     () => {
//       console.log("c");
//     },
//     (err) => {
//       console.log(err.message);
//       return "d";
//     }
//   )
//   .then(
//     (d) => console.log("d"),
//     (e) => {
//       console.log("e");
//     }
//   );

  new Promise(function (resolve, reject) {
    resolve("a");
    throw new Error("b");
    reject("b")
  })
    .then(console.log)
    .catch(console.log);