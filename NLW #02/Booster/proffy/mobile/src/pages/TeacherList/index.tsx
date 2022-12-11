import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';

import api from '../../services/api';

const TeacherList: React.FC = () => {
  const [isfiltersVisible, setIsFiltersVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [time, setTime] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });

        setFavorites(favoritedTeachersIds);
      }
    });
  }

  function handleToggleFilters () {
    setIsFiltersVisible(!isfiltersVisible);
  }

  async function searchTeacher() {
    loadFavorites();
    const response = await api.get('/classes', {
      params: {
        subject,
        week_day: weekDay,
        time,
      }
    });
  
    setIsFiltersVisible(false);
    setTeachers(response.data);
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  return(
    <View style={styles.container}>
      <PageHeader title="Proffs disponiveis" headerRight={(
        <BorderlessButton onPress={handleToggleFilters}>
          <Feather name="filter" size={20} color="#fff"  />
        </BorderlessButton>
      )}>
        { isfiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <RNPickerSelect
                onValueChange={(value) => setSubject(value)}
                style={pickerSelectStyles}
                placeholder="Qual a matéria?"
                value={subject}
                items={[
                  { value: 'Artes', label: 'Artes' },
                  { value: 'Fisica', label: 'Fisica' },
                  { value: 'Matematica', label: 'Matematica' },
                  { value: 'Geografia', label: 'Geografia' },
                  { value: 'Historia', label: 'Historia' },
                  { value: 'Portugues', label: 'Portugues' },
                  { value: 'Biologia', label: 'Biologia' }
                ]}
              />
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <RNPickerSelect
                  onValueChange={(value) => setWeekDay(value)}
                  style={pickerSelectStyles}
                  placeholder="Qual o dia?"
                  value={weekDay}
                  items={[
                    { label: 'Domingo', value: '0' },
                    { label: 'Segunda-feira', value: '1' },
                    { label: 'Terça-feira', value: '2' },
                    { label: 'Quarta-feira', value: '3' },
                    { label: 'Quinta-feira', value: '4' },
                    { label: 'Sexta-feira', value: '5' },
                    { label: 'Sabado', value: '6' },
                  ]}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <RNPickerSelect
                  onValueChange={(value) => setTime(value)}
                  style={pickerSelectStyles}
                  placeholder="Qual o horário?"
                  value={time}
                  items={[
                    { label: '07:00', value: '07:00' },
                    { label: '08:00', value: '08:00' },
                    { label: '09:00', value: '09:00' },
                    { label: '10:00', value: '10:00' },
                    { label: '11:00', value: '11:00' },
                    { label: '12:00', value: '12:00' },
                    { label: '13:00', value: '13:00' },
                    { label: '14:00', value: '14:00' },
                    { label: '15:00', value: '15:00' },
                    { label: '16:00', value: '16:00' },
                    { label: '17:00', value: '17:00' },
                    { label: '18:00', value: '18:00' },
                    { label: '19:00', value: '19:00' },
                    { label: '20:00', value: '20:00' },
                  ]}
                />
              </View>
            </View>

            <RectButton style={styles.submitButton} onPress={searchTeacher}>
              <Text style={styles.submitButtonText}>Filtar</Text>
            </RectButton>

          </View> 
        )}
      </PageHeader>

      <ScrollView style={ styles.teacherList } contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16
      }}>
      
        {teachers.map((teacher: Teacher) => {
          return(
            <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)} />
          )
        })}
      </ScrollView>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 54,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
});
export default TeacherList;