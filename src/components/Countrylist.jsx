import Spinner from './Spinner'
import styles from './CountryList.module.css'
import Message from './Message'
import CountryItem from './CountryItem'
import { useCities } from '../contexts/CitiesContext'

function CountryList() {
    const { isLoading, cities } = useCities();
    if (isLoading) return <Spinner />

    if (!cities.length) {
        return <Message message='Add your first city by clicking on a city on map' />
    }

    const countries = cities.reduce((arr, city) => {
        if (!arr.map(ele => ele.country).includes(city.country)) return [...arr, { country: city.country, emoji: city.emoji }]
        return arr;
    }, [])
    return (
        <ul className={styles.countryList}>
            {countries.map((country, index) => <CountryItem key={index} country={country} />)}
        </ul>
    )
}

export default CountryList
