import { Injectable } from "@angular/core";
import { HttpClient  } from "@angular/common/http";

import { Booking } from "../models/booking";

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  selectedBooking: Booking;
  bookings: Booking[] = [];
  readonly URL_API = "http://localhost:3000/api/booking";


  constructor(private http: HttpClient) {
    this.selectedBooking = new Booking();
  }

  postBooking(booking: Booking) {
    return this.http.post<Booking>(this.URL_API, booking);
  }

  getBookings() {
    return this.http.get<Booking[]>(this.URL_API);
  }


  getBooking(id:string) {
    return this.http.get<Booking>(this.URL_API + `/${id}` );
  }

  putBooking(file:File,id:string) {
    const fd = new FormData();
    fd.append('video', file);
    let id2="65dd5ff007a02203edd2be01"
    return this.http.put(this.URL_API + `/${id2}`,fd );
  }

  deleteBooking(id: string) {
    return this.http.delete(this.URL_API + `/${id}` );
  }
}
