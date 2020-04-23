import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/ErrorModal";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { useHttpClient } from "../../shared/Hooks/http-hook";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setloadedPlaces] = useState(null);

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/getplacebyuserid/${userId}`
        );
        setloadedPlaces(responseData.places);
        console.log(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setloadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner overlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;

// const UserPlaces = () => {
//   const DUMMY_PLACES = [
//     {
//       id: "p1",
//       title: "TAJ MAHAL",
//       description: "One of the oldest monument",
//       imageUrl:
//         "https://upload.wikimedia.org/wikipedia/commons/1/15/Taj_Mahal-03.jpg",
//       address: "AGRA",
//       location: {
//         lat: 12.555456,
//         lng: -78.789654,
//       },
//       creator: "u1",
//     },
//     {
//       id: "p2",
//       title: "Red Fort",
//       description: "One of the oldest building in India",
//       imageUrl:
//         "https://upload.wikimedia.org/wikipedia/commons/2/2c/Redfortdelhi1.jpg",
//       address: "Delhi",
//       location: {
//         lat: 27.1751,
//         lng: -78.0421,
//       },
//       creator: "u2",
//     },
//   ];
