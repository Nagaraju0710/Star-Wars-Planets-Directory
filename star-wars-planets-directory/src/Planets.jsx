import React, { useState, useEffect } from 'react';
import './Planents.css';

import buttonClickSound from './sound.mp4';

function Planets() {
    const [planets, setPlanets] = useState([]);
    const [nextPage, setNextPage] = useState('');
    const [prevPage, setPrevPage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [residentData, setResidentData] = useState({});

    useEffect(() => {
        fetchPlanets('https://swapi.dev/api/planets/?format=json');
    }, []);

    const fetchPlanets = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setPlanets(data.results);
            setNextPage(data.next);
            setPrevPage(data.previous);
        } catch (error) {
            console.error('Error fetching planets:', error);
        }
    };

    const fetchResidents = async (residentUrls) => {
        const promises = residentUrls.map(async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        });
        const residentData = await Promise.all(promises);
        return residentData;
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(prevState => prevState + 1);
            fetchPlanets(nextPage);
            playButtonClickSound();
        }
    };

    const handlePrevPage = () => {
        if (prevPage) {
            setCurrentPage(prevState => prevState - 1);
            fetchPlanets(prevPage);
            playButtonClickSound();
        }
    };

    const playButtonClickSound = () => {
        const audio = new Audio(buttonClickSound);
        audio.play();
    };

    const fetchAndSetResidentData = async (residentUrls, index) => {
        const residentsData = await fetchResidents(residentUrls);
        setResidentData(prevState => ({
            ...prevState,
            [index]: residentsData,
        }));
    };


    useEffect(() => {
        planets.forEach((planet, index) => {
            if (planet.residents.length > 0) {
                fetchAndSetResidentData(planet.residents, index);
            }
        });
    }, [planets]);

    return (
        <div className="App">
            <h1 id='heading'>Star Wars Planets Directory</h1>
            <div className="planets-container">
                {planets.map((planet, index) => (
                    <div key={index} className="planet-card">
                        <h2>{planet.name}</h2>
                        <p><span>Climate:</span>{planet.climate}</p>
                        <p><span>Population:</span> {planet.population}</p>
                        <p><span>Terrain:</span> {planet.terrain}</p>
                        <h3><span>Residents:</span></h3>
                        <ul>
                            {residentData[index] ? (
                                residentData[index].map((resident, i) => (
                                    <li key={i}>
                                        {resident.name} - {resident.height} cm - {resident.mass} kg - {resident.gender}
                                    </li>
                                ))
                            ) : (
                                <li>No residents</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={!prevPage}>
                    Prev
                </button>
                <span>Page : {currentPage}</span>
                <button onClick={handleNextPage} disabled={!nextPage}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Planets;
