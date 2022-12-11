import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';
import ladingImg from '../../assets/images/landing.svg';
import studyIcon from '../../assets/images/icons/study.svg';
import giveClassesIcon from '../../assets/images/icons/give-classes.svg';
import puppleHeartIcon from '../../assets/images/icons/purple-heart.svg';

import './styles.css';
import api from '../../services/api';

export default function Landing() {
    const [totalConnections, setTotalConnectioms] = useState(0);

    useEffect(() => {
        async function loadConnections() {
            const response = await api.get('/connections');
            setTotalConnectioms(response.data.total)
        }

        loadConnections()
    }, [totalConnections]);
    return (
        <div id="page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logo} alt="Logo"/>
                    <h2>Sua plataforma de estudos online.</h2>
                </div>

                <img src={ladingImg} alt="Plataforma de estudos" className="hero-image"/>

                <div className="buttons-container">
                    <Link to='/study' className="study">
                        <img src={studyIcon} alt="Estudar"/>
                        Estudar
                    </Link>

                    <Link to="/give-classes" className="give-classes">
                        <img src={giveClassesIcon} alt="Dar aula"/>
                        Dar aulas
                    </Link>
                </div>

                <span className="total-connections">
                 {`Total de ${totalConnections} conexões realizadas`}<img src={puppleHeartIcon} alt="Coração Roxo"/>
                </span>
            </div>
        </div>
    )
}