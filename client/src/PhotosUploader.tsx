import axios from "axios";
import React, { useState, type Dispatch, type SetStateAction } from "react";

type PhotosUploaderProps = {
  addedPhotos: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export default function PhotosUploader({ addedPhotos, onChange }: PhotosUploaderProps) {
  const [photoLink, setPhotoLink] = useState('');

  async function addPhotoByLink(ev: React.FormEvent) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
      onChange(prev => [...prev, filename]);
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
      headers: { 'Content-type': 'multipart/form-data' },
    }).then(response => {
      const { data: filenames } = response;
      onChange(prev => [...prev, ...filenames]);
    });
  }

  return (
    <>
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
    </>
  );
}
