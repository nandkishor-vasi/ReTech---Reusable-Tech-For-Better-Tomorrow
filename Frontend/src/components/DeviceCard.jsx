// components/DeviceCard.js
import { Link } from 'react-router-dom';

const DeviceCard = ({ device }) => (
  <div className="card">
    <div className="card-image">
      <figure className="image is-4by3">
        <img src={device.image} alt={device.name} />
      </figure>
    </div>
    <div className="card-content">
      <div className="media">
        <div className="media-content">
          <p className="title is-4">{device.name}</p>
          <p className="subtitle is-6">{device.type}</p>
        </div>
      </div>
      <div className="content">
        <p>Condition: {device.condition}</p>
        <p>Status: {device.status}</p>
        <Link to={`/device/${device.id}`} className="button is-primary mt-3">
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default DeviceCard;