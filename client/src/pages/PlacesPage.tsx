import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import AccountNav from "../AccountNav"
import axios from "axios"
import PlaceImg from "../PlaceImg"

export default function PlacesPage() {
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

  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    axios.get('/user-places').then(({data}) => {
      setPlaces(data);
    })
  }, []);
  return (
    <div>
      <AccountNav />
        <div className="text-center max-w-lg mx-auto mt-8">
          <Link className="inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full " to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path fillRule="evenodd" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new place
          </Link>
          <div className="mt-4">
            {places.length > 0 && places.map(place => (
              <Link to={'/account/places/' + place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                  <PlaceImg place={place} />
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
}