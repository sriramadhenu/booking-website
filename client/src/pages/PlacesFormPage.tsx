import { useState, useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import PhotosUploader from "../PhotosUploader"
import Perks from "../Perks"
import axios from "axios"
import AccountNav from "../AccountNav"

export default function PlacesFormPage() {
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!id){
      return;
    }
    axios.get('places/' + id).then(response => {
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

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

  async function savePlace(ev: React.FormEvent) {
    ev.preventDefault();
    const placeData = { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price };
    if (id) {
      // update
      try {
        await axios.put('/places', {
          id, ...placeData
        })
        setRedirect(true);
      } catch (error) {
        console.error("Failed to submit form:", error);
        console.log("didn't work");
      }
    } else {
      // new place
      try {
        await axios.post('/places', placeData);
        setRedirect(true);
      } catch (error) {
        console.error("Failed to submit form:", error);
        console.log("didn't work");
      }
    }
  }


  if (redirect){
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
        <AccountNav />
        <form onSubmit={savePlace}>
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
            placeholder="address"
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
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4 min-w-0">
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
                <div className="flex flex-col">
                    <h3 className="mt-2 -mb-1">Price per night</h3>
                    <input
                    type="number"
                    value={price}
                    onChange={ev => setPrice(Number(ev.target.value))}
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
  );
}
