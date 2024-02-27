export class Booking {
  _id?: string;
  video: Array<string>;
  response: string;

  constructor(
    _id :string = "",
    video: Array<string> = [],
    response: string = "",

  ) {
    this._id = _id;
    this.video = video;
    this.response = response;
  }
}