import { createContext, useContext, useReducer, useEffect } from 'react';

const TripContext = createContext();

const tripReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_STAY':
            return { ...state, stay: action.payload };
        case 'ADD_TRANSPORT':
            return { ...state, transportation: action.payload };
        case 'ADD_ACTIVITY':
            
            if (state.sightseeing.some(item => item._id === action.payload._id)) {
                return state;
            }
            return { ...state, sightseeing: [...state.sightseeing, action.payload] };
        case 'REMOVE_ACTIVITY':
            return {
                ...state,
                sightseeing: state.sightseeing.filter(item => item._id !== action.payload)
            };
        case 'CLEAR_TRIP':
            return { stay: null, transportation: null, sightseeing: [] };
        case 'LOAD_TRIP':
            return action.payload;
        default:
            return state;
    }
};

export const TripProvider = ({ children }) => {
    const [trip, dispatch] = useReducer(tripReducer, {
        stay: null,
        transportation: null,
        sightseeing: []
    }, (initial) => {
        
        const saved = localStorage.getItem('tripCart');
        return saved ? JSON.parse(saved) : initial;
    });

    useEffect(() => {
        localStorage.setItem('tripCart', JSON.stringify(trip));
    }, [trip]);

    const addStay = (stay) => dispatch({ type: 'ADD_STAY', payload: stay });
    const addTransportation = (transport) => dispatch({ type: 'ADD_TRANSPORT', payload: transport });
    const addActivity = (activity) => dispatch({ type: 'ADD_ACTIVITY', payload: activity });
    const removeActivity = (id) => dispatch({ type: 'REMOVE_ACTIVITY', payload: id });
    const clearTrip = () => dispatch({ type: 'CLEAR_TRIP' });

    return (
        <TripContext.Provider value={{
            trip,
            addStay,
            addTransportation,
            addActivity,
            removeActivity,
            clearTrip
        }}>
            {children}
        </TripContext.Provider>
    );
};

export const useTrip = () => {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
};
