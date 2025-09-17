import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import React from "react";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
  const [photoLink, setPhotoLink] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);

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

  async function addPhotoByLink(ev: React.FormEvent) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
      setAddedPhotos(prev => [...prev, filename]);
      setPhotoLink('');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        alert("Error uploading image. Please try again.");
      } else {
        alert("Upload failed. Please try again.");
      }
    }
  }

  function uploadPhoto(ev: React.ChangeEvent<HTMLInputElement>) {
    const files = ev.target.files;
    const data = new FormData();
    if (files) {
      Array.from(files).forEach(file => {
        data.append('photos', file);
      });
    }
    axios.post('/upload', data, {
      headers: { 'Content-type': 'multipart/form-data' }
    }).then(response => {
      const { data: filenames } = response;
      setAddedPhotos(prev => [...prev, ...filenames]);
    });
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
          <form>
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={'Add using a link ...jpg'}
                value={photoLink}
                onChange={ev => setPhotoLink(ev.target.value)}
              />
              <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
            </div>
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div className="h-32 flex relative" key={link}>
                  <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/' + link} alt="" />
                </div>
              ))}
              <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-550 mr-2">
                <input type="file" className="hidden" multiple onChange={uploadPhoto} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload
              </label>
            </div>
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
