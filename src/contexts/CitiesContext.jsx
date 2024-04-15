import { createContext, useContext, useEffect, useReducer } from "react";

const URL = 'http://localhost:9000/cities';

const CitiesContext = createContext();

const initialState = {
    isLoading: false,
    cities: [],
    currentCity: {},
    error: ""
}

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, isLoading: true }

        case 'cities/loaded':
            return { ...state, cities: action.payload, isLoading: false }
        case 'cities/currentCity':
            return { ...state, currentCity: action.payload, isLoading: false }
        case 'cities/createCity':
            return { ...state, cities: [...state.cities, action.payload], isLoading: false }
        case 'cities/deleteCity':
            return { ...state, cities: state.cities.filter((city) => city.id !== action.payload), isLoading: false }
        case 'rejected':
            return
        default: return new Error('Invalid action');
    }

}

function CitiesProvider({ children }) {
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    const [{ cities, isLoading, error, currentCity }, dispatch] = useReducer(reducer, initialState)

    useEffect(function () {
        async function fetchCities() {
            dispatch({ type: "loading" })
            try {
                const response = await fetch(URL);
                const data = await response.json();
                dispatch({ type: "cities/loaded", payload: data })
            }
            catch (err) {
                console.log(err.message)
            }

        }
        fetchCities();
    }, [])

    async function getCity(id) {
        if (currentCity.id === id) {
            return
        }
        dispatch({ type: "loading" })
        try {
            const res = await fetch(`http://localhost:9000/cities/${id}`)
            const data = await res.json();
            dispatch({ type: 'cities/currentCity', payload: data })            // console.log(currentCity)
        } catch (error) {
            alert(error.message);
        }
    }

    async function createCity(newCity) {
        dispatch({ type: "loading" })
        try {
            const res = await fetch(`http://localhost:9000/cities`, {
                method: 'Post',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json();
            dispatch({ type: 'cities/createCity', payload: data })
        } catch (error) {
            alert(error.message);
        }

    }
    async function deleteCity(id) {
        dispatch({ type: "loading" })
        try {
            console.log(id)
            await fetch(`http://localhost:9000/cities/${id}`, {
                method: 'Delete'
            })
            dispatch({ type: "cities/deleteCity", payload: id })
            // setCities(cities => cities.filter(city => city.id !== id))
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, error, getCity, currentCity, createCity, deleteCity }}>
            {children}
        </CitiesContext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error("CitiesContext is used outside the citiesProvider")
    return context;
}

export { CitiesProvider, useCities }
