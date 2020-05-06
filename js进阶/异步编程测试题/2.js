Promise.resolve("a").then("b").then(Promise.resolve("c")).then(console.log);
