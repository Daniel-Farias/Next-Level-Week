/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, FormEvent, useEffect } from 'react';

import Header from '../../components/Header';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import Input from '../../components/Input';
import Select from '../../components/Select';

import './styles.css';
import api from '../../services/api';

export default function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    async function searchTeachers(e?: FormEvent) {
        e?.preventDefault();

       const response = await api.get('/classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setTeachers(response.data);
    }

    useEffect(() => {
        if(time !== ''){
            console.log('exec')
            searchTeachers();
        }
    }, [subject, week_day, time]);
    
    return (
        <div id="page-teacher-list">
           <Header title="Estes são os proffys disponíveis">
               <form id="search-teachers" onSubmit={searchTeachers}>
                    <Select name="subject" label="Matéria" options={[
                       {value: 'Artes', label: 'Artes'},
                       {value: 'Fisica', label: 'Fisica'},
                       {value: 'Matematica', label: 'Matematica'},
                       {value: 'Geografia', label: 'Geografia'},
                       {value: 'Historia', label: 'Historia'},
                       {value: 'Portugues', label: 'Portugues'},
                       {value: 'Biologia', label: 'Biologia'}
                   ]} value={subject} onChange={(e) => { setSubject(e.target.value) }} />

                    <Select name="week_day" label="Dia da semana" options={[
                       {value: '0', label: 'Domingo'},
                       {value: '1', label: 'Segunda-feira'},
                       {value: '2', label: 'Terça-feira'},
                       {value: '3', label: 'Quarta-feira'},
                       {value: '4', label: 'Quinta-feira'},
                       {value: '5', label: 'Sexta-feira'},
                       {value: '6', label: 'Sábado'}
                   ]} onChange={(e) => { setWeekDay(e.target.value) }} value={week_day} /> 

                   <Input name="time" label="Hora" type="time" onChange={(e) => { setTime(e.target.value) }} value={time} /> 
               </form>
           </Header>
           <main>
               {teachers.map((teacher: Teacher) => {
                return <TeacherItem key={teacher.id} teacher={teacher} />
               })}
           </main>
        </div>
    )
}