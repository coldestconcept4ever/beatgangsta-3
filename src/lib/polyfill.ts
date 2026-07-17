// Polyfill DOMMatrix and DOMMatrixReadOnly for pdf.js / pdf-parse text extraction in Node.js
class DOMMatrixPolyfill {
  a: number = 1;
  b: number = 0;
  c: number = 0;
  d: number = 1;
  e: number = 0;
  f: number = 0;

  constructor(init?: any) {
    if (typeof init === 'string') {
      const match = init.replace(/\s+/g, '').match(/^matrix\(([^)]+)\)$/i);
      if (match) {
        const parts = match[1].split(',').map(Number);
        if (parts.length === 6 && parts.every(p => !isNaN(p))) {
          this.a = parts[0];
          this.b = parts[1];
          this.c = parts[2];
          this.d = parts[3];
          this.e = parts[4];
          this.f = parts[5];
        }
      }
    } else if (Array.isArray(init)) {
      if (init.length === 6) {
        this.a = init[0];
        this.b = init[1];
        this.c = init[2];
        this.d = init[3];
        this.e = init[4];
        this.f = init[5];
      } else if (init.length === 16) {
        this.a = init[0];
        this.b = init[1];
        this.c = init[4];
        this.d = init[5];
        this.e = init[12];
        this.f = init[13];
      }
    } else if (init && typeof init === 'object') {
      this.a = typeof init.a === 'number' ? init.a : 1;
      this.b = typeof init.b === 'number' ? init.b : 0;
      this.c = typeof init.c === 'number' ? init.c : 0;
      this.d = typeof init.d === 'number' ? init.d : 1;
      this.e = typeof init.e === 'number' ? init.e : 0;
      this.f = typeof init.f === 'number' ? init.f : 0;
    }
  }

  get m11() { return this.a; } set m11(v) { this.a = v; }
  get m12() { return this.b; } set m12(v) { this.b = v; }
  get m21() { return this.c; } set m21(v) { this.c = v; }
  get m22() { return this.d; } set m22(v) { this.d = v; }
  get m41() { return this.e; } set m41(v) { this.e = v; }
  get m42() { return this.f; } set m42(v) { this.f = v; }

  get m13() { return 0; }
  get m14() { return 0; }
  get m23() { return 0; }
  get m24() { return 0; }
  get m31() { return 0; }
  get m32() { return 0; }
  get m33() { return 1; }
  get m34() { return 0; }
  get m43() { return 0; }
  get m44() { return 1; }

  get is2D() { return true; }
  get isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
  }

  translate(tx = 0, ty = 0, tz = 0) {
    const result = new DOMMatrixPolyfill();
    result.a = this.a;
    result.b = this.b;
    result.c = this.c;
    result.d = this.d;
    result.e = this.e + tx * this.a + ty * this.c;
    result.f = this.f + tx * this.b + ty * this.d;
    return result;
  }

  scale(sx = 1, sy = sx, sz = 1, ox = 0, oy = 0, oz = 0) {
    const result = new DOMMatrixPolyfill();
    result.a = this.a * sx;
    result.b = this.b * sx;
    result.c = this.c * sy;
    result.d = this.d * sy;
    result.e = this.e;
    result.f = this.f;
    return result;
  }

  multiply(other: any) {
    const result = new DOMMatrixPolyfill();
    result.a = this.a * other.a + this.c * other.b;
    result.b = this.b * other.a + this.d * other.b;
    result.c = this.a * other.c + this.c * other.d;
    result.d = this.b * other.c + this.d * other.d;
    result.e = this.a * other.e + this.c * other.f + this.e;
    result.f = this.b * other.e + this.d * other.f + this.f;
    return result;
  }

  multiplySelf(other: any) {
    const res = this.multiply(other);
    this.a = res.a; this.b = res.b; this.c = res.c; this.d = res.d; this.e = res.e; this.f = res.f;
    return this;
  }

  preMultiplySelf(other: any) {
    const res = other.multiply(this);
    this.a = res.a; this.b = res.b; this.c = res.c; this.d = res.d; this.e = res.e; this.f = res.f;
    return this;
  }

  translateSelf(tx = 0, ty = 0, tz = 0) {
    const res = this.translate(tx, ty, tz);
    this.a = res.a; this.b = res.b; this.c = res.c; this.d = res.d; this.e = res.e; this.f = res.f;
    return this;
  }

  scaleSelf(sx = 1, sy = sx, sz = 1, ox = 0, oy = 0, oz = 0) {
    const res = this.scale(sx, sy, sz, ox, oy, oz);
    this.a = res.a; this.b = res.b; this.c = res.c; this.d = res.d; this.e = res.e; this.f = res.f;
    return this;
  }

  toString() {
    return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
  }
}

if (typeof (global as any).DOMMatrix === "undefined") {
  (global as any).DOMMatrix = DOMMatrixPolyfill;
}
if (typeof (global as any).DOMMatrixReadOnly === "undefined") {
  (global as any).DOMMatrixReadOnly = DOMMatrixPolyfill;
}
