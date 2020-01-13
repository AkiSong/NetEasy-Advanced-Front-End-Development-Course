function traversal(linkedList, callback) {
  let linkedNode = linkedList.head || linkedList.next;
  callback(linkedNode.value);
  if (linkedNode.next) traversal(linkedNode, callback);
}

const NodeD = {
  value: 4,
  next: null
};

const NodeC = {
  value: 3,
  next: NodeD
};

const NodeB = {
  value: 2,
  next: NodeC
};

const NodeA = {
  value: 1,
  next: NodeB
};

const LinkedList = {
  head: NodeA
};

let sum = 0
traversal(LinkedList, current => (sum += current));

console.log(sum);
