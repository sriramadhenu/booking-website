import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import React from "react";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);

  function inputHeader(text: string) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text: string) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header: string, description: string) {
    return (
      <div>
        {inputHeader(header)}
        {inputDescription(description)}
      </div>
    );
  }

  async function addNewPlace(ev: React.FormEvent) {
    ev.preventDefault();
    const placeData = { title, address, addedPhotos, 
        description, perks, extraInfo, checkIn, checkOut, maxGuests };
    await axios.post('/places', placeData);
    setRedirectToPlacesList(true);
  }

  if (redirectToPlacesList && !action) {
    return <Navigate to={'account/places'} />
  }

  return (
    <div>
      {action !== 'new' && (
        <div className="text-center max-w-lg mx-auto mt-8">
          <Link className="inline-flex gap-1 bg-primary text-white py-2 px-5 rounded-full " to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path fillRule="evenodd" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === 'new' && (
        <div>
          <form onSubmit={addNewPlace}>
            {preInput('Title', 'Title for your place, should be short and catchy')}
            <input
              type="text"
              placeholder="title, for example: My lovely apt"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
            />
            {preInput('Address', 'Address to this place')}
            <input
              type="text"
              placeholder='address'
              value={address}
              onChange={ev => setAddress(ev.target.value)}
            />
            {preInput('Photos', 'Photos go here')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput('Description', 'Add a description of the place')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
            {preInput('Perks', 'Select all the perks of your place')}
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            {preInput('Extra info', 'house rules, etc.')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
            {preInput('Check in & out times, max guests', '')}
            <div className="grid gap-2 sm:grid-cols-3 min-w-0">
              <div className="flex flex-col">
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="time"
                  value={checkIn}
                  onChange={ev => setCheckIn(ev.target.value)}
                  className="h-10 px-2 w-full"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input
                  type="time"
                  value={checkOut}
                  onChange={ev => setCheckOut(ev.target.value)}
                  className="h-10 px-2 w-full"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="mt-2 -mb-1">Max guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={ev => setMaxGuests(Number(ev.target.value))}
                  placeholder="10"
                  className="h-10 px-2 w-full"
                />
              </div>
            </div>
            <div>
              <button className="primary my-4">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
