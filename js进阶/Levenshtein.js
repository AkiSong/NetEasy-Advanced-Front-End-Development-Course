/**
 * 莱温斯坦距离问题
 *
 * 莱文斯坦距离，又称Levenshtein距离，是编辑距离的一种。指两个字串之間，
 * 由一个转成另一个所需的最少编辑操作次数。
 *
 * 允许的编辑操作包括：
 * 将一个字符替换成另一个字符
 * 插入一个字符
 * 刪除一个字符
 * 俄羅斯科學家弗拉基米尔·莱文斯坦在1965年提出這個概念。
 *
 * 参考：https://leetcode-cn.com/problems/edit-distance/
 */

export const Levenshtein = (string1, string2) => {
  const len1 = string1.length;
  const len2 = string2.length;

  let matrix = [];

  for (let i = 0; i <= len1; i++) {
    // 构造二维数组
    matrix[i] = [];
    for (let j = 0; j <= len2; j++) {
      // 初始化
      if (i == 0) {
        matrix[i][j] = j; //边界距离, 假定d[1...0]转换为t[1...j]需要 j 个步骤
      } else if (j == 0) {
        matrix[i][j] = i; //边界距离, 假定d[1...i]转换为t[1...0]需要 i 个步骤
      } else {
        // 进行最小值分析
        let cost = 0;
        if (string1[i - 1] != string2[j - 1]) {
          // d[i-1] == t[j-1] 相同, 那么最小距离d[i-1][j-1]+0，不同置 +1
          cost = 1;
        }
        const temp = matrix[i - 1][j - 1] + cost;
        // 矩阵算法, 对于字符串 d[1...i]转换为字符串t[1...j], 在d[i][j]位置抓换为t[i][j]的值为该位置左上, 上, 左三个值中的最小值
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          temp
        );
      }
    }
  }
  return matrix[len1][len2]; //返回举证最右下角的值
};
