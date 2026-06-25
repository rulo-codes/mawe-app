import React, { useRef, useEffect, useState } from 'react';
import './search.css';

import testData from '../data/weather.json'

export default function Search({locSelected, setLocSelected, map, setWeatherData}){
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const debounceTimer = useRef(null);

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    //Trigger search when query changes
    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        // Debounce: Wait 300ms after the user stops typing to call the API
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(debounceTimer.current);
    }, [query])

    const fetchSuggestions = async (searchString) => {
        if(locSelected) return;
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchString)}.json?key=${apiKey}&autocomplete=true&types=place,region,country&language=en&proximity=ip`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            // MapTiler returns results inside a "features" array
            setSuggestions(data.features || []);
            setIsOpen(true);
        } catch (error) {
            console.error("Geocoding API Error:", error);
        }
    };

    const fetchWeather = (feature) => {
        const locationName = feature.text_en;
        const locationPlace = feature.place_name_en;
        setWeatherData({coordinates: feature.center, name: locationName, place: locationPlace, weather_data: testData})
    }

    const handleSelectLocation = (feature) => {
        if(!locSelected) {setLocSelected(true)};
        console.log(feature);
        setSuggestions([]);
        setIsOpen(false);
        setQuery(feature.place_name);

        fetchWeather(feature);

        const [lng, lat] = feature.center;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        if (map.current) {
            map.current.flyTo({
                center: [lng, lat],
                zoom: 11,
                padding: { left: isMobile ? 0 : 350 },
                speed: 1.5,
                essential: true
            });
        }

    };

    const handleKeyDown = (e) => {
    // Check if the pressed key is 'Enter'    
        if (e.key === 'Enter') {
        // Prevent standard form submission behavior if wrapped in a form
            e.preventDefault();
            e.currentTarget.blur();

            // Check if we actually have matches in our suggestions array
            if (suggestions && suggestions.length > 0) {
                const bestMatch = suggestions[0]; // The top result is the most accurate

                handleSelectLocation(bestMatch);
            }
        }else if(locSelected){
            setLocSelected(false);
        }
    };

    const handleSearchButton = (e) => {
        if (suggestions && suggestions.length > 0) {
            const bestMatch = suggestions[0]; // The top result is the most accurate
                
            setQuery(bestMatch.place_name);
            setIsOpen(false);

            handleSelectLocation(bestMatch);
        }
    }

    return (
        <div className="search-wrapper">
            <div className="search-ctrl">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Search...'
                    className='search-input'
                    onFocus={() => {setLocSelected(false)}}
                />
                <button className='search-btn' onClick={() => {setQuery(""); setLocSelected(false)}}>X</button>
                <button className='search-btn' onClick={handleSearchButton}>Q</button>
            </div>
            <div className="search-result">
                {isOpen && suggestions.length > 0 && (
                    <ul className="search-result-list">
                        {suggestions.map((feature) => (
                            <li 
                            key={feature.id} 
                            onClick={() => handleSelectLocation(feature)}
                            className="search-result-list-item"
                            >
                            {feature.place_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}