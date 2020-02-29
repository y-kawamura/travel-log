import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 35.027316,
    longitude: 135.798238,
    zoom: 12
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries); 
  }

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [ longitude, latitude ] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude 
    });
    event.preventDefault();
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/tetora/ck76t3gmt0qdp1jpgv76e893q"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker
              latitude={entry.latitude}
              longitude={entry.longitude}
            >
              <div 
                onClick={() => setShowPopup({
                  // ...showPopup,
                  [entry._id]: true,
                })}
              >
                <img className="marker" src="https://i.imgur.com/y0G5YTX.png" alt={entry.title} />
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setShowPopup({})}
                  anchor="top" >
                  <div className="popup">
                    <h3>{entry.title}</h3>
                    <p>{entry.comments}</p>
                    {entry.image && <img src={entry.image} alt={entry.title} /> }
                    <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                  </div>
                </Popup>
              ) : null
            }
          </React.Fragment>
        ))
      }
      {
        addEntryLocation ? (
          <>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <img className="marker" src="https://i.imgur.com/y0G5YTX.png" alt="new entry location" />
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
              <div className="popup">
                <LogEntryForm 
                  location={addEntryLocation}
                  onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}
                />
              </div>
            </Popup>
          </>
        ) : null
        
      }
    </ReactMapGL>
  );
}

export default App;