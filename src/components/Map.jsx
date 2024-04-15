import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet'
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';


function Map() {
    const [mapPostion, setMapPostion] = useState([40, 0])
    const { cities } = useCities();
    const { isLoading: isLoadingPosition, position: geolocationPosition, getPosition } = useGeolocation();
    const [mapLat, mapLng] = useUrlPosition();


    useEffect(function () {
        if (mapLat && mapLat) setMapPostion([mapLat, mapLng]);

    }, [mapLat, mapLng])

    useEffect(function () {
        if (geolocationPosition) setMapPostion([geolocationPosition.lat, geolocationPosition.lng])
    }, [geolocationPosition])


    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && <Button type="position" onclick={getPosition}>
                {isLoadingPosition ? "Loading..." : "Use your Position"}
            </Button>}
            <MapContainer center={mapPostion} zoom={13} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {
                    cities.map((city) => <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            <span>{city.emoji}</span><span>{city.cityName}</span>
                        </Popup>
                    </Marker>)
                }
                <ChangeCenter position={mapPostion} />
                <DetectClick />
            </MapContainer></div>
    )
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();
    useMapEvent({
        click: (e) => {
            console.log(e.latlng);
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        }
    })

}


export default Map
