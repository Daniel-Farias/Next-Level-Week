import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  image: string;
  name: string;
  image_url: string;
  item_id: number;
}

const SearchPoints = (props: any) => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data)
    })
  }, []);

  useEffect(() => {
    api.get('points', {
      params: {
        uf: props.location.state.uf, 
        city: props.location.state.city,
        items: [ 1, 2, 3, 4, 5, 6 ]
      }
    }).then(response => {
      setPoints(response.data);
    })
  }, [props.location.state.city, props.location.state.uf]);
  return (
   <div id="page-search-points">
     <header>
       <img src={logo} alt="Ecoleta" />
       <Link to="/">
         <FiArrowLeft />
         Voltar para home
       </Link>
     </header>
     <span className="items_count">
      {points.length} ponto(s) encontrados
     </span>

    <ul>
      {points.map(point => (
        <div className="point_container" key={point.id}>
          <img className="image_point" src={point.image_url} alt="Imagem" />
          <span className="point_name">{point.name}</span>
          <br />
          <br />
          <span className="point_items">{items.map(item => item.title).join(', ')}</span>  
          <div className="address">
            <span className="address_content">{props.location.state.city}, {props.location.state.uf}</span>
          </div>
        </div>
      ))}
    </ul>
   </div>
  )
}

export default SearchPoints;