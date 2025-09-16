import { Link, useParams } from "react-router-dom";

export default function PlacesPage() {
    const {action} = useParams();
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
                    <h2 className="text-2xl mt-4">Title</h2>
                    <p className="text-gray-500 text-sm">Title for your place, should be short and eye-catching</p>
                    <input type="text" placeholder='title, for example: My lovely apt'/>
                    <h2 className="text-2xl mt-4">Address</h2>
                    <p className="text-gray-500 text-sm">Address to this place</p>
                    <input type="text" placeholder='address'/>
                    <h2 className="text-2xl mt-4">Photos</h2>
                    <p className="text-gray-500 text-sm">Photos go here</p>
                    <div className="flex gap-2">
                        <input type="text" placeholder={'Add using a link ...jpg'}/>
                        <button className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        <button className="flex gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-550 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                        </button>
                    </div>
                    <h2 className="text-2xl mt-4">Description</h2>
                    <p className="text-gray-500 text-sm">Add a description of the place</p>
                    <textarea/>
                    <h2 className="text-2xl mt-4">Perks</h2>
                    <p className="text-gray-500 text-sm">Select all the perks of your place</p>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

                    </div>
                </form>
            </div>
        )}
        
    </div>
  );
}