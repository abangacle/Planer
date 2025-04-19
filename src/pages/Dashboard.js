import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import Button from '../components/common/Button';
import StorageService from '../services/storage';

const DashboardContainer = styled.div`
  padding: 1.5rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const Greeting = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const DateDisplay = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
`;

const CardIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CardSubtext = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const TasksSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TaskItem = styled.div`
  padding: 1rem;
  border-radius: 6px;
  background-color: var(--background-secondary);
  border-left: 3px solid ${props => 
    props.priority === 'high' ? 'var(--error-color)' : 
    props.priority === 'medium' ? 'var(--warning-color)' : 
    'var(--success-color)'};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const TaskTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TaskMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  gap: 1rem;
`;

const TaskTag = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-size: 0.75rem;
  font-weight: 500;
`;

const UpcomingSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const EventTime = styled.div`
  min-width: 80px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: right;
`;

const EventContent = styled.div`
  flex: 1;
  border-left: 2px solid var(--primary-color);
  padding-left: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    left: -6px;
    top: 0px;
  }
`;

const EventTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const EventDetails = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
`;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingEvents: 0,
    activeProjects: 0
  });
  
  useEffect(() => {
    // Fetch tasks
    const loadedTasks = StorageService.getTasks();
    setTasks(loadedTasks);
    
    // Fetch events
    const loadedEvents = StorageService.getEvents();
    setEvents(loadedEvents);
    
    // Calculate stats
    setStats({
      totalTasks: loadedTasks.length,
      completedTasks: loadedTasks.filter(task => task.status === 'completed').length,
      upcomingEvents: loadedEvents.length,
      activeProjects: StorageService.getProjects().filter(p => p.status === 'active').length
    });
  }, []);
  
  // Filter tasks for today
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Filter upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };
  
  return (
    <DashboardContainer>
      <WelcomeSection>
        <Greeting>{getGreeting()}, User!</Greeting>
        <DateDisplay>{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</DateDisplay>
      </WelcomeSection>
      
      <SummarySection>
        <SummaryCard>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
            <CardIcon>✓</CardIcon>
          </CardHeader>
          <CardValue>{stats.totalTasks}</CardValue>
          <CardSubtext>{stats.completedTasks} tasks completed</CardSubtext>
        </SummaryCard>
        
        <SummaryCard>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardIcon>📅</CardIcon>
          </CardHeader>
          <CardValue>{todayTasks.length}</CardValue>
          <CardSubtext>Due today</CardSubtext>
        </SummaryCard>
        
        <SummaryCard>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardIcon>🗓️</CardIcon>
          </CardHeader>
          <CardValue>{stats.upcomingEvents}</CardValue>
          <CardSubtext>Scheduled events</CardSubtext>
        </SummaryCard>
        
        <SummaryCard>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardIcon>🎯</CardIcon>
          </CardHeader>
          <CardValue>{stats.activeProjects}</CardValue>
          <CardSubtext>In progress</CardSubtext>
        </SummaryCard>
      </SummarySection>
      
      <ContentSection>
        <TasksSection>
          <SectionHeader>
            <h2>Today's Tasks</h2>
            <Button type="secondary" size="small">
              Add Task
            </Button>
          </SectionHeader>
          
          <TaskList>
            {todayTasks.length > 0 ? (
              todayTasks.map(task => (
                <TaskItem key={task.id} priority={task.priority === 3 ? 'high' : task.priority === 2 ? 'medium' : 'low'}>
                  <TaskTitle>
                    {task.title}
                    <TaskTag>{task.category}</TaskTag>
                  </TaskTitle>
                  <TaskMeta>
                    <span>Due: {format(new Date(task.dueDate), 'HH:mm')}</span>
                    {task.project && <span>Project: {task.project}</span>}
                  </TaskMeta>
                </TaskItem>
              ))
            ) : (
              <EmptyState>
                <p>No tasks scheduled for today.</p>
                <Button type="primary" style={{ marginTop: '1rem' }}>
                  Add Your First Task
                </Button>
              </EmptyState>
            )}
          </TaskList>
        </TasksSection>
        
        <UpcomingSection>
          <SectionHeader>
            <h2>Upcoming Events</h2>
          </SectionHeader>
          
          <EventList>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <EventItem key={event.id}>
                  <EventTime>
                    {format(new Date(event.startTime), 'HH:mm')}
                  </EventTime>
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDetails>
                      {event.location && `📍 ${event.location}`}
                    </EventDetails>
                  </EventContent>
                </EventItem>
              ))
            ) : (
              <EmptyState>
                <p>No upcoming events.</p>
                <Button type="primary" style={{ marginTop: '1rem' }}>
                  Schedule Event
                </Button>
              </EmptyState>
            )}
          </EventList>
        </UpcomingSection>
      </ContentSection>
    </DashboardContainer>
  );
};

export default Dashboard; 