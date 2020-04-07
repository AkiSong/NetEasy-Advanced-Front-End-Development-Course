<script>
const grids = new Array(8)
  .fill(1)
  .map((_, r) =>
    new Array(8)
      .fill(1)
      .map((_, c) => ({ key: `key-${r * 8}-${c}`, ok: false }))
  );
export default {
  data() {
    return {
      grids,
    };
  },
  render() {
    return (
      <div class="grid">
        {this.grids.map((row, index) => {
          return (
            <div class="row" key={index}>
              {row.map((cell, i) => {
                return <div class="cell" key={i}></div>;
              })}
            </div>
          );
        })}
      </div>
    );
  },
};
</script>

<style></style>
