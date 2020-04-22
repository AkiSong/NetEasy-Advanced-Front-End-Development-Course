/*
写一个数据储存对象
项目中有一个群居的数据储存者, 这个储存者只能有一个
*/

function Store() {
  if (store.install) {
    return store.install;
  }
  this.store = {};
  store.install = this;
}
store.install = null;
