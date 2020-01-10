function pipe() {
  let args = [].slice.call(arguments);
  console.log(args)
  return function(x) {
    return args.reduce(function(res, cb) {
      return cb(res);
    }, x);
  };
}

console.log(pipe()(10))