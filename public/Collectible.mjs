class Collectible {

  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;

    this.radius = 10;
  }

}

try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;