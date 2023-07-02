export class Field {
  piece: String = '';
  captured: boolean = false;
  turned: boolean = false;

  setPiece(piece: String) {
    this.piece = piece;
  }

  setCaptured(captured: boolean) {
    this.captured = captured;
  }

  setTurned(turned: boolean) {
    this.turned = turned;
  }
}
