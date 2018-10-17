class Vector2d{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2d(this.x, this.y);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        var inv = 1 / this.length();
        this.x *= inv;
        this.y *= inv;
        return this;
    }

    add($vec) {
        this.x += $vec.x;
        this.y += $vec.y;
        return this;
    }

    multiply($f) {
        this.x *= $f;
        this.y *= $f;
        return this;
    }

    dot($vec) {
        return this.x * $vec.x + this.y * $vec.y;
    }

    cross($vec) {
        return this.x * $vec.y + this.y * $vec.x;
    }

    angle($vec) {
        return Math.acos(this.dot($vec) / (this.length() * $vec.length())) * 180 / Math.PI;
    }

    distanceSquare($x, $y) {
        return this.x * $x + this.y * $y;
    }
}