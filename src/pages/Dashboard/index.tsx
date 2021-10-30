import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import {
  Container, Header, HeaderContent,
  Profile, Content, Schedule, Calendar,
  NextAppointment, Section, Appointment,
} from './styles';

import 'react-day-picker/lib/style.css';

import logoImg from '../../assets/Logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem{
  day : number;
  avalability : boolean
}

interface Appointment {
  id : string;
  date : string;
  hourFormatted : string;
  user : {
      name : string;
      avatar_url : string;
  }
}

const Dashboard : React.FC = () => {
  const { signOut, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleMonthChange = useCallback((month : Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day : Date, modifiers : DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      },
    }).then((response) => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      },
    }).then((response) => {
      const appontmentsFormatted = response.data.map((appointment) => (
        {
          ...appointment, hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
        }));
      setAppointments(appontmentsFormatted);
    });
  }, [selectedDate]);

  const disabledDays = useMemo(() => format(selectedDate, "'Dia' dd 'de' MMMM", {
    locale: ptBR,
  }), [selectedDate]);

  const disableDays = useMemo(() => {
    const date = monthAvailability.filter((monthDay) => monthDay.avalability === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return date;
  }, [currentMonth, monthAvailability]);

  const selectedWeekDay = useMemo(() => format(selectedDate, 'cccc', { locale: ptBR }), [selectedDate]);

  /* eslint max-len: ["error", { "code": 180 }] */
  const morningAppointments = useMemo(() => appointments.filter((appointment) => parseISO(appointment.date).getHours() < 12), [appointments]);

  const afternoonAppointments = useMemo(() => appointments.filter((appointment) => parseISO(appointment.date).getHours() >= 12), [appointments]);

  const nextAppointment = useMemo(() => appointments.find((appointment) => isAfter(parseISO(appointment.date), new Date())), [appointments]);

  return (
    <Container>

      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>

              <span>Bem vindo</span>
              <Link to="/profile">
                {' '}
                <strong>{user.name}</strong>
                {' '}
              </Link>

            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>

        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            { isToday(selectedDate) && <span>Hoje</span>}
            <span>{disabledDays}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src={nextAppointment?.user.avatar_url} alt="Bernardo" />

              <strong>
                {' '}
                {nextAppointment?.user.name}
                {' '}
              </strong>
              <span>
                <FiClock />
                {nextAppointment.hourFormatted}
              </span>
            </div>
          </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  {appointment.user.avatar_url && <img src={appointment.user.avatar_url} alt={appointment.user.name} />}

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}

          </Section>

        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              { daysOfWeek: [0, 6] }, ...disableDays,
            ]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />

        </Calendar>

      </Content>

    </Container>

  );
};

export default Dashboard;
