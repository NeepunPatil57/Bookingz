import {useState} from "react";
import { Carousel } from "react-responsive-carousel";
export default function PlaceGallery({place}){
    const [morePhotos,setmorePhotos] = useState(false);
    if (morePhotos) {
        return (
          <div className="absolute inset-0 bg-black text-white min-h-screen">
            <div className="bg-black p-8">
              <div>
                <h2 className="text-3xl mr-48 mb-4">More Photos of {place.title}</h2>
                <button
                  onClick={() => setmorePhotos(false)}
                  className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                  Close More
                </button>
              </div>
              <Carousel showThumbs={false}>
                {place?.photos?.length > 0 &&
                  place.photos.map((photo, index) => (
                    <div key={index}>
                      <div className="flex justify-center items-center h-[850px] w-[auto]">
                        <img
                          src={"http://localhost:4000/uploads/" + photo}
                          alt={`Photo ${index + 1}`}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  ))}
              </Carousel>
            </div>
          </div>
        );
      }
    return(
        <div className="relative">
          <div className="grid gap-2 grid-cols-[2fr_1fr]">
            <div>
              {place.photos?.[0] && (
                <img
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt="No Image"
                  className="aspect aspect-square object-cover"
                  onClick={() => setmorePhotos(true)}
                />
              )}
              <div className="flex font-semibold text-xl bg-gray-400">
                <button className="absolute bottom-4 left-4 flex bg-black text-white font-bold py-2 px-4 mt-4 rounded-md" onClick={() => setmorePhotos(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <span className="pt-2 py-2">More Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    );
}