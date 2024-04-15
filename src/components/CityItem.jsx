import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useCities } from '../contexts/CitiesContext';

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));


function CityItem({ city }) {
    const { id, emoji, date, cityName, position } = city;
    const { currentCity, deleteCity } = useCities();


    function handleclick(e) {
        e.preventDefault();
        deleteCity(id);
    }
    return (
        <li >
            <Link className={`${styles.cityItem} ${id === currentCity.id ? styles["cityItem--active"] : ""}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({formatDate(date)})</time>
                <button className={styles.deleteBtn} onClick={handleclick}>&times;</button>
            </Link>
        </li>
    )
}

export default CityItem
