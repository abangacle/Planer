import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTaskContext } from '../../contexts/TaskContext';
import { format, startOfWeek, addDays, isWithinInterval, subWeeks, isAfter } from 'date-fns';
import { id } from 'date-fns/locale';

const AnalyticsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  margin-top: 1.5rem;
  height: 200px;
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid var(--border-color);
  position: relative;
`;

const BarColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Bar = styled.div`
  width: 70%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  height: ${props => props.height || '0px'};
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  position: relative;
  
  &:hover {
    opacity: 0.8;
    &::after {
      content: '${props => props.count} tugas';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      white-space: nowrap;
      margin-bottom: 0.25rem;
    }
  }
`;

const AxisLabel = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.color};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background-color: var(--background-secondary);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.color || 'var(--primary-color)'};
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const TaskAnalytics = () => {
  const { tasks, stats } = useTaskContext();
  
  // Menghitung data untuk grafik mingguan
  const weeklyData = useMemo(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Mulai dari Senin
    
    // Inisialisasi data kosong untuk 7 hari
    const days = [];
    const dayData = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfCurrentWeek, i);
      days.push(format(day, 'EEE', { locale: id })); // Format: Sen, Sel, Rab, ...
      
      // Count tasks for each day
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Hitung semua tugas pada hari tersebut
      const allTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return isWithinInterval(taskDate, { start: dayStart, end: dayEnd });
      }).length;
      
      // Hitung tugas selesai pada hari tersebut
      const completedTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return isWithinInterval(taskDate, { start: dayStart, end: dayEnd }) && task.status === 'completed';
      }).length;
      
      dayData.push({
        day: format(day, 'd MMM', { locale: id }),
        all: allTasks,
        completed: completedTasks
      });
    }
    
    return { days, dayData };
  }, [tasks]);
  
  // Menghitung metrik tambahan
  const metrics = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = subWeeks(today, 1);
    
    // Tugas minggu ini
    const tasksThisWeek = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return isAfter(taskDate, oneWeekAgo);
    }).length;
    
    // Rata-rata waktu penyelesaian
    const completedTasks = tasks.filter(task => task.status === 'completed' && task.timeSpent);
    const avgCompletionTime = completedTasks.length > 0
      ? Math.round(completedTasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0) / completedTasks.length)
      : 0;
    
    // Rasio penyelesaian
    const completionRatio = tasks.length > 0
      ? Math.round((stats.completed / tasks.length) * 100)
      : 0;
    
    // Tugas prioritas tinggi yang tertunda
    const pendingHighPriority = tasks.filter(task => 
      task.status !== 'completed' && task.priority === 3
    ).length;
    
    return {
      tasksThisWeek,
      avgCompletionTime,
      completionRatio,
      pendingHighPriority
    };
  }, [tasks, stats]);
  
  // Menghitung tinggi bar berdasarkan nilai maksimum
  const getBarHeight = (value, maxValue) => {
    if (maxValue === 0) return '0px';
    const maxHeight = 180; // tinggi maksimum dalam pixel
    return `${(value / maxValue) * maxHeight}px`;
  };
  
  // Mencari nilai maksimum untuk skala grafik
  const maxTaskCount = useMemo(() => {
    return Math.max(...weeklyData.dayData.map(day => day.all), 5); // minimum 5 untuk skala
  }, [weeklyData]);
  
  return (
    <AnalyticsContainer>
      <SectionTitle>Analitik Produktivitas</SectionTitle>
      
      <MetricsGrid>
        <MetricCard>
          <MetricValue>{metrics.tasksThisWeek}</MetricValue>
          <MetricLabel>Tugas Dibuat Minggu Ini</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue color="var(--success-color)">{metrics.completionRatio}%</MetricValue>
          <MetricLabel>Rasio Penyelesaian Tugas</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue color="var(--warning-color)">{metrics.avgCompletionTime} menit</MetricValue>
          <MetricLabel>Rata-rata Waktu Penyelesaian</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue color="var(--error-color)">{metrics.pendingHighPriority}</MetricValue>
          <MetricLabel>Tugas Prioritas Tinggi Tertunda</MetricLabel>
        </MetricCard>
      </MetricsGrid>
      
      <SectionTitle>Aktivitas Mingguan</SectionTitle>
      
      <ChartContainer>
        {weeklyData.dayData.map((data, index) => (
          <BarColumn key={index}>
            <Bar 
              height={getBarHeight(data.all, maxTaskCount)} 
              color="var(--primary-light)"
              count={data.all}
            />
            <Bar 
              height={getBarHeight(data.completed, maxTaskCount)} 
              color="var(--success-color)"
              count={data.completed}
              style={{ position: 'absolute', bottom: 0, width: '30%', marginLeft: '20px' }}
            />
            <AxisLabel>{weeklyData.days[index]}</AxisLabel>
          </BarColumn>
        ))}
      </ChartContainer>
      
      <Legend>
        <LegendItem>
          <LegendColor color="var(--primary-light)" />
          <span>Total Tugas</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="var(--success-color)" />
          <span>Tugas Selesai</span>
        </LegendItem>
      </Legend>
    </AnalyticsContainer>
  );
};

export default TaskAnalytics; 