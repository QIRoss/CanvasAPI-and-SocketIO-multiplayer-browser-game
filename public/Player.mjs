class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;

    this.width = 30;
    this.height = 30;
    this.speed = 3;
  }

  processInput(buttons) {
    if(buttons.w && !buttons.s) {
      this.movePlayer("up", this.speed);
    } else if(buttons.s && !buttons.w) {
      this.movePlayer("down", this.speed);
    } 
    if(buttons.a && !buttons.d) {
      this.movePlayer("left", this.speed);
    } else if(buttons.d && !buttons.a) {
      this.movePlayer("right", this.speed);
    }
  }

  movePlayer(dir, speed) {
    if(dir == "up"){
      if(this.y > speed + this.height/2) {
        this.y -= speed;
      } else {
        this.y = this.height/2;
      }
    }

    if(dir == "down") {
      if(this.y < 480 - speed - this.height/2) {
        this.y += speed;
      } else {
        this.y = 480 - this.height/2;
      }
    }

    if(dir == "left") {
      if(this.x > speed + this.width/2) {
        this.x -= speed;
      } else {
        this.x = this.width/2;
      }
    }
    
    if(dir == "right") {
      if(this.x < 640 - speed - this.width/2) {
        this.x += speed;
      } else {
        this.x = 640 - this.width/2;
      }
    }
  }

  collision(item) {
    // Credits to markE
    // https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
    return ((circle,rect) => {
      const distX = Math.abs(circle.x - rect.x);
      const distY = Math.abs(circle.y - rect.y);

      if (distX > (rect.width/2 + circle.radius)) { return false; }
      if (distY > (rect.height/2 + circle.radius)) { return false; }

      if (distX <= (rect.width/2)) { return true; } 
      if (distY <= (rect.height/2)) { return true; }

      const dx = distX-rect.width / 2;
      const dy = distY-rect.height / 2;
      return (dx*dx + dy*dy <= (circle.radius * circle.radius));
    })(item,this)
  }

  calculateRank(players) {
    let playerAboveMe = 0;
    Object.values(players).forEach(player => {
      if(player.score > this.score) {
        playerAboveMe++;
      }
    })

    return "Rank: " + (playerAboveMe + 1) + "/" + Object.values(players).length;
  }
}

export default Player;