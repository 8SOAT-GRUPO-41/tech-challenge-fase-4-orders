export class Payment {
  constructor(
    readonly paymentId: string,
    readonly orderId: string,
    private _status: string
  ) {}
  setStatus(status: string) {
    this._status = status;
  }
  get status() {
    return this._status;
  }
}
