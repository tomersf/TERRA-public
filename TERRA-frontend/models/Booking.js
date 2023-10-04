class Booking{
    constructor(userId, bookingId, bookingDate, bookingHours, available,asset) {
        this.userId = userId;
        this.bookingId = bookingId;
        this.bookingDate = bookingDate;
        this.bookingHours = bookingHours;
        this.available = available;
        this.asset = asset;
    }
}


export default Booking;