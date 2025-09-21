import { useState, useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { differenceInCalendarDays } from 'date-fns'
import axios from 'axios'
import { UserContext } from "./UserContext"

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


type BookingWidgetProps = {
    place: Place;
}

export default function BookingWidget({ place }: BookingWidgetProps) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState('');
    const context = useContext(UserContext);
    
    if (!context) {
        throw new Error("UserContext.Provider is missing");
    }
    const { user } = context;

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user])

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() { 
        const response = await axios.post('/bookings', {
            checkIn, checkOut, numberOfGuests, 
            name, phone, place:place._id, 
            price: numberOfNights * place.price,
        });
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        <input type="date" value={checkIn} 
                            onChange={ev => setCheckIn(ev.target.value)}/>
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check out:</label>
                        <input type="date" value={checkOut} 
                            onChange={ev => setCheckOut(ev.target.value)}/>
                    </div>
                </div>
                <div className="py-3 px-4 border-t">
                    <label>Number of guests:</label>
                    <input type="number" value={numberOfGuests} 
                        onChange={ev => setNumberOfGuests(parseInt(ev.target.value))}/>
                </div>
                {numberOfNights > 0 && (
                    <div className="py-3 px-4 border-t">
                        <label>Your full name:</label>
                        <input type="text" 
                            value={name} 
                            onChange={ev => setName(ev.target.value)}/>
                        <label>Phone number:</label>
                        <input type="tel" 
                            value={phone} 
                            onChange={ev => setPhone(ev.target.value)}/>
                    </div>
                )}
            </div>
            <button onClick={bookThisPlace} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}
                </button>
        </div>
    );
}