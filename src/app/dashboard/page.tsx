import { JSX } from 'react';
import Link from 'next/link';

interface Place {
  id: number;
  title: string;
  image: string;
  description: string;
  mapImage: string;
}

const places: Place[] = [
  {
    id: 1,
    title: 'Central Park',
    image: 'https://assets.api.uizard.io/api/cdn/stream/67b35ead-16ee-49ef-89c2-1dcb094d0037.png',
    description: 'A large urban park in the heart of the city, offering various recreational activities.',
    mapImage: 'https://assets.api.uizard.io/api/cdn/stream/664e0392-f164-4ec9-8c2b-2758c9a98224.png',
  },
  {
    id: 2,
    title: 'City Mall',
    image: 'https://assets.api.uizard.io/api/cdn/stream/67b35ead-16ee-49ef-89c2-1dcb094d0037.png',
    description: 'A popular shopping destination with various retail stores and eateries.',
    mapImage: 'https://assets.api.uizard.io/api/cdn/stream/591c3537-b6e0-4b86-afe0-247a66d301cd.png',
  },
  {
    id: 3,
    title: 'Urban Plaza',
    image: 'https://assets.api.uizard.io/api/cdn/stream/157aa0a8-ede9-4f2d-8acb-c0cb6e0b240f.png',
    description: 'A contemporary urban space featuring public art and seating areas.',
    mapImage: 'https://assets.api.uizard.io/api/cdn/stream/48c0cd04-992d-46b5-b945-887a7bb2982f.png',
  }
];

export default function Places(): JSX.Element {
  return (
    <div className=" max-w-[1440px] mx-auto px-8 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center mt-24">
        {places.map((place) => (
          <div 
            key={place.id} 
            className="w-full max-w-[441px] h-[644px] bg-[#efeff6] rounded-[2px] shadow-md 
                     overflow-hidden transition-transform duration-200 ease-in-out hover:-translate-y-1
                     flex flex-col mx-auto
                     sm:w-[441px] md:w-[441px]
                     md:h-[644px]"
          >
            <div className="w-full h-[250px] overflow-hidden">
              <img 
                src={place.image} 
                alt={place.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-col flex-1 p-6">
              <h3 className="text-[1.75rem] font-bold mb-4 text-gray-800">
                {place.title}
              </h3>
              
              <p className="text-base text-gray-600 mb-6 leading-relaxed flex-1">
                {place.description}
              </p>
              
              <div className="w-full h-[200px] rounded-lg overflow-hidden mb-4">
                <img 
                  src={place.mapImage} 
                  alt={`${place.title} map`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Link 
                href={`/dashboard/space`}
                className="w-full py-4 bg-white text-black text-base font-medium 
                         rounded hover:bg-blue-600 hover:text-white transition-all duration-200
                         mt-auto text-center"
              >
                Access Space
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}