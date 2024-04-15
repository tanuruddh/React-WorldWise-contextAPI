// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {

  return countryCode.toUpperCase().replace(/./g, char =>
    String.fromCodePoint(127397 + char.charCodeAt())
  );
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(function () {
    if (!lat && !lng) return;

    async function fetchData() {
      try {
        setGeoCodingError("")
        setIsLoadingGeocoding(true);
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json();
        if (!data.countryCode) throw new Error("That does seems to be a city, clcik somewhere esle")
        setCityName(data.city);
        setCountry(data.country);
        setEmoji(convertToEmoji(data.countryCode));
        setIsLoadingGeocoding(false);
      }
      catch (err) {
        setGeoCodingError(err.message);
      }
      finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchData();
  }, [lat, lng])

  async function handleSubmit(e) {
    e.preventDefault();

    if (!date || !cityName) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng }
    }

    await createCity(newCity)
    navigate('/app');

  }

  if (!lat && !lng) return <Message message="Starrt by clicking on map" />
  if (geoCodingError) return <Message message={geoCodingError} />

  if (isLoadingGeocoding) return <Spinner />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker onChange={date => setDate(date)} selected={date} dateFormat="dd/MM/yyyy" />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
