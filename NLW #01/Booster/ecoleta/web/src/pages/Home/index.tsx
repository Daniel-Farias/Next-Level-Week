import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiSearch } from 'react-icons/fi';
import { Modal } from "react-responsive-modal";
import axios from 'axios';


import './styles.css';
import './styles_modal.css';

import logo from '../../assets/logo.svg';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [isFull, setIsFull] = useState(false);
  const [ufs, setUfs] = useState<string[]>([]);
  const [city, setCitys] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  function openModal() {
    setIsFull(true);
  }

  function closeModal() {
    setIsFull(false);
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    })
  }, []);

  useEffect(() => {
    if(selectedUf === '0'){
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityName = response.data.map(city => city.nome);

      setCitys(cityName);
    })
  }, [selectedUf]);


  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
    const city = event.target.value;
    setSelectedCity(city);
  }

  return (
   <div id="page-home">
     <div className="content">
        <Modal open={isFull} onClose={closeModal}>
          <div className="container">
            <h1>Ponto de coleta</h1>
            <select name="uf" id="uf" onChange={handleSelectedUf} value={selectedUf}>
               <option value="0">Selecione uma UF</option>
               {ufs.map(uf => (
                 <option key={uf} value={uf}>{uf}</option>
               ))}
             </select>

             <select name="city" id="city" onChange={handleSelectedCity} value={selectedCity}>
               <option value="0">Selecione uma Cidade</option>
               {city.map(city => (
                 <option key={city} value={city}>{city}</option>
               ))}
             </select>

            <Link to={{
                      pathname: '/search-points',
                      state: { uf: selectedUf, city: selectedCity, }
                    }}>
              Buscar
            </Link>
          </div>
        </Modal>
     <header>
       <img src={logo} alt="Ecoleta" />
       <Link to="/create-point">
         <FiLogIn />
         Cadastre um ponto de coleta
       </Link>
     </header>
        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente.</p>
          <button onClick={openModal}>
            <span>
              <FiSearch />
            </span>
            <strong>Procure pontos de coleta</strong>
          </button>
        </main>
     </div>
   </div>
  )
}

export default Home;