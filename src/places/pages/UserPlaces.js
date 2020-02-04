import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "TAJ MAHAL",
    description: "MOST BEAUTIFULL MONUMENT IN INDIA!!",
    img:
      "https://www.thoughtco.com/thmb/8zQSM6u3jiB4C1D7lBVuPq_ASTc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/TajMahal-56a3651f5f9b58b7d0d1b482.jpg",
    address: "AGRA , INDIA",
    location: {
      lat: 27.17425500000002,
      lng: 78.04243300000007
    },
    creator: "u1"
  },
  {
    id: "p1",
    title: "TAJ MAHAL",
    description: "MOST BEAUTIFULL MONUMENT IN INDIA!!",
    img:
      "https://www.thoughtco.com/thmb/8zQSM6u3jiB4C1D7lBVuPq_ASTc=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/TajMahal-56a3651f5f9b58b7d0d1b482.jpg",
    address: "AGRA , INDIA",
    location: {
      lat: 27.17425,
      lng: 78.0424
    },
    creator: "u2"
  }
];

const UserPlaces = () => {
  const userId = useParams().userId;
  console.log(userId);
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

  return <PlaceList items={loadedPlaces} />;
};
export default UserPlaces;
