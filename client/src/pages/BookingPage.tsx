import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import AddressLink from "../AddressLink"
import PlaceGallery from "../PlaceGallery"
import BookingDates from "../BookingDates"

type Place = {
  _id?: string;
  owner?: string;
  title: string;
  address: string;
  photos: string[];
  description: string;
  perks: string[];
  extraInfo: string;
  checkIn: string;
  checkOut: string;
  maxGuests: number;
  price: number;
};

type Booking = {
  _id?: string;
  checkIn: string;
  checkOut: string;
  place: Place;
  price: number;
};

export default function BookingPage() {
    const {id} = useParams();
    const [booking, setBooking] = useState<Booking | null>(null);

    
    useEffect(() => {
        if (id) {
            axios.get<Booking[]>('/bookings').then(response => {
                const foundBooking = response.data.find(({ _id }) => _id === id);
                if (foundBooking) setBooking(foundBooking);
            });
        }
    }, [id]);

    if (!booking){
        return '';
    }

    return (
        <div className="my-8">
            <h1 className="text-3xl">{booking.place.title}</h1>
            <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
            <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h2 className="text-2xl mb-4">Your booking information</h2>
                    <BookingDates booking={booking} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>Total price</div>
                    <div className="text-3xl">${booking.price}</div>
                </div>
            </div>
            <PlaceGallery place={booking.place} />
        </div>
    );
}