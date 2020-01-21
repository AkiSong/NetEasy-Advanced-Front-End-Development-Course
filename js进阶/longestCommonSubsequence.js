/**
 * 字符串算法
 *
 * 在virtual DOM做Diff Patch操作中，有一条准则就是同一层的节点进行diff patch，从一个dom
 * 节点转换为另外一个dom节点的过程我们可以抽象的看成从字符串ABCDEFG切换到ACDFG, 如何保证
 * 在操作过程中尽量只做节点移动，减少插入和删除的操作使我们的目标。
 *
 * 这个练习主要围绕字符串操作进行这一方面的理解。
 */

/**
 * 最长公共子序列
 *
 * 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对
 * 顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
 * 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
 * 两个字符串的「公共子序列」是这两个字符串所共同拥有的子序列。
 * 若这两个字符串没有公共子序列，则返回 0。
 *
 * 参考：https://leetcode-cn.com/problems/longest-common-subsequence/
 */

const longestCommonSubsequence = (string1, string2) => {
  let arr1 = string1.split('');
  let arr2 = string2.split('');
  let newArr = [];
  let len = 0;
  for (let i = 0; i < arr1.length; i++) {
    for (let j = len; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        len = j;
        newArr.push(arr2[j]);
        break;
      }
    }
  }
  return newArr.length;
};

const lcsamples = [
  {
    string1: "abcde",
    string2: "ace",
    count: 3
  },
  {
    string1: "abc",
    string2: "abc",
    count: 3
  },
  {
    string1: "abc",
    string2: "def",
    count: 0
  }
];

lcsamples.forEach(({ string1, string2, count }) => {
  let flag = longestCommonSubsequence(string1, string2) === count;
  console.log(flag);
});
