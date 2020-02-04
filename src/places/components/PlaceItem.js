import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceItem.css";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";

const PlaceItem = props => {
  const [showmap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const coord = { lat: -73.984638, lng: 40.748366 };

  return (
    <React.Fragment>
      <Modal
        show={showmap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={coord} zoom={16} />
        </div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item-image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            <Button to={`/places/${props.div}`}>EDIT</Button>
            <Button danger>DELETE</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
export default PlaceItem;