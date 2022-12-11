import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Map, TileLayer, Marker} from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import { Modal } from "react-responsive-modal";
import api from '../../services/api';

import DropZone from '../../components/DropZone';

import './styles.css';
import './styles_modal.css';

import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  image_url: string;
  title: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


const CreatePoint = () => {
  const [isFull, setIsFull] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [city, setCitys] = useState<string[]>([]);
  const [initialCoords, setInitialCoords] = useState<[number, number]>([0, 0]);
  

  const [formData, setFormData] = useState({
    name: '',
    email:'',
    whatsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialCoords([
        latitude,
        longitude
      ])
    })
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    })
  }, []);

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

  function handleMapClick(event: LeafletMouseEvent){
    setCoords([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const { name, value } = event.target;

    setFormData({...formData, [name]: value })
  }

  function handleSelectedItem(id: number){
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if(alreadySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
  
    }else{
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = coords;
    const items = selectedItems;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    
    if(selectedFile){
      data.append('image', selectedFile);
    }

    await api.post('points', data);
    setIsFull(true);
    setTimeout(function(){ 
      history.push("/");
    }, 3000);
  }

  return (
   <div id="page-create-point">
     <header>
       <img src={logo} alt="Ecoleta" />
       <Link to="/">
         <FiArrowLeft />
         Voltar para home
       </Link>
     </header>

     <Modal open={isFull} onClose={() => {}}>
        <div className="container">
          <FiCheckCircle size={54} color="#34CB79" />
          <h1>Cadastro concluído!</h1>
        </div>
      </Modal>
    

     <form onSubmit={handleSubmit}>
       <h1>Cadastro do <br /> ponto de coleta</h1>
      <DropZone onFileUploaded={setSelectedFile} />

       <fieldset>
         <legend>
           <h2>Dados</h2>
         </legend>

         <div className="field">
           <label htmlFor="name">Nome da entidade</label>
           <input type="text" name="name" id="name" onChange={handleInputChange} />
         </div>

         <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="text" name="email" id="email" onChange={handleInputChange} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
          </div>
         </div>
       </fieldset>

       <fieldset>
         <legend>
           <h2>Endereço</h2>
           <span>Selecione o endereço no mapa</span>
         </legend>

         <Map center={initialCoords} zoom={15} onClick={handleMapClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={coords} />
         </Map>

         <div className="field-group">
           <div className="field">
             <label htmlFor="uf">Estado (UF)</label>
             <select name="uf" id="uf" onChange={handleSelectedUf} value={selectedUf}>
               <option value="0">Selecione uma UF</option>
               {ufs.map(uf => (
                 <option key={uf} value={uf}>{uf}</option>
               ))}
             </select>
           </div>
           <div className="field">
             <label htmlFor="city">Cidade</label>
             <select name="city" id="city" onChange={handleSelectedCity} value={selectedCity}>
               <option value="0">Selecione uma Cidade</option>
               {city.map(city => (
                 <option key={city} value={city}>{city}</option>
               ))}
             </select>
           </div>
         </div>
       </fieldset>

       <fieldset>
         <legend>
           <h2>Ítens de coleta</h2>
           <span>Selecione um o mais ítens abaixo</span>
         </legend>

         <ul className="items-grid">
          {items.map(item => (
            <li key={item.id} onClick={() => { handleSelectedItem(item.id) }}
            className={selectedItems.includes(item.id) ? 'selected': ''}>
              <img src={item.image_url} alt={item.title} />
              <span>{item.title}</span>
            </li>
          ))}
         </ul>
       </fieldset>

       <button type="submit">
         Cadastrar ponto de coleta
       </button>
     </form>
   </div>
  )
}

export default CreatePoint;