var longestCommonSubsequence = function(txt1, txt2) {
  debugger
  let dp = [new Array(txt2.length + 1).fill(0)];
  for (let i = 0; i < txt1.length; i++) {
    dp[i + 1] = [0];
    for (let j = 0; j < txt2.length; j++) {
      if (txt1[i] === txt2[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }
  return dp[dp.length - 1][dp[0].length - 1];
};


let txt1 = 'abcde'
let txt2 = 'aec'

longestCommonSubsequence(txt1, txt2)