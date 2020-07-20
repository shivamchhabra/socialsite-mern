import React, { useState, useContext } from "react";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button/Button";
import Modal from "../../../src/shared/components/Modal/Modal";
import ErrorModal from "../../shared/components/ErrorModal";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import Map from "../../shared/components/Map/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/Hooks/http-hook";

import "./PlaceItem.css";

const PlaceItem = (props) => {
  console.log(`http://localhost:5000/${props.image}`);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const [deletebox, setdeleteBox] = useState(false);

  const opendeletebox = () => {
    setdeleteBox(true);
  };

  const closedeleteBox = () => {
    setdeleteBox(false);
  };

  const confirmDeletePlace = async () => {
    setdeleteBox(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
    props.onDelete(props.id);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={deletebox}
        onCancel={closedeleteBox}
        header="Are you sure ??"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closedeleteBox}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeletePlace}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          cannot be undone after it is done...
        </p>
      </Modal>

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>

      <li className="place-item">
        {isLoading && (
          <div class="center">
            <LoadingSpinner overlay />
          </div>
        )}
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL_SHORT}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3> {props.address}</h3>
            <p>{props.description} </p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on map
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={opendeletebox}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default PlaceItem;