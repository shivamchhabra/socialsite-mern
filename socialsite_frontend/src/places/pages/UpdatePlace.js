import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";
import Button from "../../shared/components/Button/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/Validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/Hooks/form-hook";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import Card from "../../shared/components/Card";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setloadedPlace] = useState(null);

  const placeId = useParams().placeId;
  console.log(placeId);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setloadedPlace(responseData);
        setFormData(
          {
            title: {
              value: loadedPlace.place.title,
              isValid: true,
            },
            description: {
              value: loadedPlace.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchUsers();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          authorization: "Bearer " + auth.token,
        }
      );
      history.push("/" + auth.userId + "/places");
    } catch (err) {}
  };

  if (!loadedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner overlay />
        </div>
      )}
      {!isLoading && error && (
        <ErrorModal error={error} onCancel={clearError} />
      )}
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.place.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.place.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;

/*const DUMMY_PLACES = [
  {
    id: "p1",
    title: "TAJ MAHAL",
    description: "One of the oldest monument",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Taj_Mahal-03.jpg",
    address: "AGRA",
    location: {
      lat: 12.555456,
      lng: -78.789654,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Red Fort",
    description: "One of the oldest building in India",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Redfortdelhi1.jpg",
    address: "Delhi",
    location: {
      lat: 27.1751,
      lng: -78.0421,
    },
    creator: "u2",
  },
];*/
