import { useState } from 'react';
import TaskPageHeader from '../../components/TaskPageHeader/taskPageHeader';
import TaskSection from '../../components/TasksSection/taskSection';
import TaskItem from '../../components/TaskItem/taskItem';
import styles from './MyTasks.module.scss';
import { INITIAL_COLUMNS } from '../../constants/mock-data';
import { Tooltip } from 'primereact/tooltip';

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(2000 + year, month - 1, day);
};

const TaskPage = () => {
  const [sections, setSections] = useState(() => {
    return [
      {
        title: 'Важные задачи',
        tasks: INITIAL_COLUMNS.flatMap(column =>
          column.cards
            .filter(card => card.priority === 'Важно' && !card.isDone)
            .map(card => ({
              id: card.id,
              title: card.title,
              description: card.description,
              isDone: card.isDone,
              startDate: card.startDate,
              endDate: card.endDate,
            }))
        ),
      },
      {
        title: 'Текущие задачи',
        tasks: INITIAL_COLUMNS.flatMap(column =>
          column.cards
            .filter(card => !card.isDone && card.priority !== 'Важно')
            .map(card => ({
              id: card.id,
              title: card.title,
              description: card.description,
              isDone: card.isDone,
              startDate: card.startDate,
              endDate: card.endDate,
            }))
        ),
      },
      {
        title: 'Выполненные задачи',
        tasks: INITIAL_COLUMNS.flatMap(column =>
          column.cards
            .filter(card => card.isDone)
            .map(card => ({
              id: card.id,
              title: card.title,
              description: card.description,
              isDone: card.isDone,
              startDate: card.startDate,
              endDate: card.endDate,
            }))
        ),
      },
    ].filter(section => section.tasks.length > 0);
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilterType, setDateFilterType] = useState<'created' | 'deadline' | null>(null);

  const handleTaskToggle = (taskId: string) => {
    setSections(prevSections => {
      const newSections = JSON.parse(JSON.stringify(prevSections));

      for (const section of newSections) {
        const taskIndex = section.tasks.findIndex((t: any) => t.id === taskId);
        if (taskIndex !== -1) {
          const task = section.tasks[taskIndex];
          task.isDone = !task.isDone;
          section.tasks.splice(taskIndex, 1);

          const targetSectionTitle = task.isDone
            ? 'Выполненные задачи'
            : task.priority === 'Важно'
            ? 'Важные задачи'
            : 'Текущие задачи';

          const targetSection = newSections.find(
            (s: any) => s.title === targetSectionTitle
          );
          if (targetSection) {
            targetSection.tasks.unshift(task);
          }

          break;
        }
      }

      return newSections;
    });
  };

  const sortTasks = (tasks: any[]) => {
    if (dateFilterType === 'created') {
      return [...tasks].sort((a, b) => {
		if (!a.startDate && !b.startDate) return 0
		if (!a.startDate) return 1
		if (!b.startDate) return -1

        const dateA = parseDate(a.startDate).getTime();
        const dateB = parseDate(b.startDate).getTime();
        return dateA - dateB; // Новые сначала
      });
	  
    } else if (dateFilterType === 'deadline') {
      return [...tasks].sort((a, b) => {
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        
        const dateA = parseDate(a.endDate).getTime();
        const dateB = parseDate(b.endDate).getTime();
        return dateA - dateB; // Ближайшие сначала
      });
    }
    return tasks;
  };

  const filterTasks = (tasks: any[]) => {
    let filtered = tasks;
    
    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return sortTasks(filtered);
  };

  const filteredSections = sections.map(section => ({
    ...section,
    tasks: filterTasks(section.tasks),
  })).filter(section => section.tasks.length > 0);

  return (
    <div className={styles.taskPage}>
      <TaskPageHeader 
        onSearchChange={setSearchTerm}
        onDateFilterChange={setDateFilterType}
        activeFilter={dateFilterType}
      />
      <Tooltip
        target='.task-item'
        position='top'
        content='Test tooltip'
        mouseTrack
        mouseTrackLeft={10}
        showDelay={150}
      />
      <div className={styles.taskContainer}>
        {filteredSections.map(section => (
          <TaskSection key={section.title} title={section.title}>
            {section.tasks.map(task => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                isDone={task.isDone}
                startDate={task.startDate}
                endDate={task.endDate}
                onToggleComplete={handleTaskToggle}
              />
            ))}
          </TaskSection>
        ))}
      </div>
    </div>
  );
};

export default TaskPage;