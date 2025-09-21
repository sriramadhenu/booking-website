
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

type PlaceImgProps = {
  place: Place;
  className?: string;
  index?: number;
};

export default function PlaceImg({ place, index=0, className }: PlaceImgProps) {
    if (!place.photos?.length){
        return '';
    }
    if (!className){
        className = 'object-cover';
    }
    return (
        <img className={className} src={'http://localhost:4000/uploads/' + place.photos[index]} alt=""/>
    );
}