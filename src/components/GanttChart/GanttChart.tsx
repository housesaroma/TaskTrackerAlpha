import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import styles from './GanttChart.module.scss';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import am5locales_ru_RU from "@amcharts/amcharts5/locales/ru_RU";
import {useParams} from "react-router-dom";
import {boardService} from '../../services/board.service';
import {Toast} from 'primereact/toast';

interface Epic {
    id: string;
    title: string;
    color: string;
}

const GanttChart = () => {
    const { projectId, boardId } = useParams<{ projectId: string; boardId: string; }>();
    const chartRef = useRef<am5.Root | null>(null);
    const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>({});
    const [epics, setEpics] = useState<Epic[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useRef<Toast>(null);
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

    const toggleEpic = (epicId: string) => {
        setExpandedEpics(prev => ({
            ...prev,
            [epicId]: !prev[epicId]
        }));
    };

    // Функция для преобразования даты
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
    };

    // Загрузка данных доски
    const loadBoardData = async () => {
        setIsLoading(true);
        try {
            const boardData = await boardService.getBoardById(parseInt(boardId!));

            // Преобразуем данные API в наш формат колонок
            const transformedColumns = boardData.columns.map((apiColumn: any) => {
                const tasks: any[] = apiColumn.tasks?.map((task: any) => ({
                    id: `${task.taskId}`,
                    title: task.title,
                    description: task.description,
                    priority: task.priorityId === 1 ? 'Важно' :
                        task.priorityId === 2 ? 'Средне' : 'Незначительно',
                    startDate: formatDate(task.dateCreated),
                    endDate: formatDate(task.deadline),
                    isDone: apiColumn.columnID === 4,
                    color: apiColumn.color,
                    type: 'task',
                    epicId: task.epicId || null,
                    createdAt: task.dateCreated,
                })) || [];

                const defects: any[] = apiColumn.defects?.map((defect: any) => ({
                    id: `defect-${defect.defectId}`,
                    title: defect.title,
                    description: defect.description,
                    priority: defect.priorityId === 1 ? 'Важно' :
                        defect.priorityId === 2 ? 'Средне' : 'Незначительно',
                    startDate: formatDate(defect.dateCreated),
                    endDate: formatDate(defect.deadline),
                    isDone: apiColumn.columnID === 4,
                    color: '#FF000080',
                    type: 'defect',
                    epicId: defect.epicId || null,
                    createdAt: defect.dateCreated,
                })) || [];

                return [...tasks, ...defects];
            });

            // Получаем все карточки из всех колонок
            const allCards = transformedColumns.flat();

            // Получаем уникальные эпики из карточек
            const uniqueEpicIds = [...new Set(allCards.map(card => card.epicId).filter(Boolean))];

            // Создаем массив эпиков (здесь нужно заменить на реальный запрос к API для получения эпиков)
            const loadedEpics = uniqueEpicIds.map(epicId => ({
                id: epicId,
                title: `Эпик ${epicId}`,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`
            }));

            // Добавляем вариант "Без эпика"
            loadedEpics.push({
                id: 'no-epic',
                title: 'Без эпика',
                color: '#CCCCCC'
            });

            setEpics(loadedEpics);
            setColumns(transformedColumns);
        } catch (error) {
            console.error('Error loading board data:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось загрузить данные для диаграммы Ганта',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (boardId && projectId) {
            loadBoardData();
        }
    }, [boardId, projectId]);

    useEffect(() => {
        if (isLoading || !columns.length || !epics.length) return;

        // Create root element
        const root = am5.Root.new("chartdiv");
        root._logo?.dispose();
        root.locale = am5locales_ru_RU;

        root.dateFormatter.setAll({
            dateFormat: 'yyyy-MM-dd',
            dateFields: ['valueX', 'openValueX'],
        });

        if (currentTheme === 'light') {
            root.setThemes([am5themes_Animated.new(root)]);
        } else {
            root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);
        }

        // Create chart
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: 'panX',
                wheelY: 'zoomX',
                paddingLeft: 0,
                layout: root.verticalLayout,
            })
        );

        // Prepare data
        const allCards = columns.flat();
        const cardsWithEpics = allCards.filter((card: any) => card.epicId);
        const cardsWithoutEpics = allCards.filter((card: any) => !card.epicId);

        // Group cards by epic
        const epicGroups: Record<string, any[]> = {};
        epics.forEach(epic => {
            if (epic.id === 'no-epic') return;
            epicGroups[epic.id] = cardsWithEpics.filter((card: any) => card.epicId === epic.id);
        });
        epicGroups['no-epic'] = cardsWithoutEpics;

        // Prepare data for chart
        const data = Object.entries(epicGroups).flatMap(([epicId, cards]) => {
            return cards
                .filter((card: any) => card.startDate && card.endDate)
                .map((card: any) => {
                    const startDateParts = card.startDate.split('.');
                    const endDateParts = card.endDate.split('.');

                    const startDate = new Date(
                        parseInt(`20${startDateParts[2]}`),
                        parseInt(startDateParts[1]) - 1,
                        parseInt(startDateParts[0])
                    );

                    const endDate = new Date(
                        parseInt(`20${endDateParts[2]}`),
                        parseInt(endDateParts[1]) - 1,
                        parseInt(endDateParts[0])
                    );

                    const epic = epics.find(e => e.id === card.epicId);
                    const color = epic ? epic.color : '#CCCCCC';

                    return {
                        category: epicId,
                        start: startDate.getTime(),
                        end: endDate.getTime(),
                        columnSettings: {
                            fill: am5.color(color),
                        },
                        task: card.title,
                        description: card.description,
                        priority: card.priority,
                        epicId: card.epicId || 'no-epic',
                        visible: expandedEpics[epicId] ?? true
                    };
                });
        });

        // Create axes
        const yRenderer = am5xy.AxisRendererY.new(root, {
            minorGridEnabled: true,
        });
        yRenderer.grid.template.set('location', 1);

        const yAxis = chart.yAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: 'category',
                renderer: yRenderer,
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        // Create custom labels for epics
        yAxis.data.setAll([
            ...epics.map(epic => ({
                category: epic.id,
                name: epic.title,
                color: epic.color
            }))
        ]);

        // Customize labels
        yAxis.get('renderer').labels.template.adapters.add('text', (text, target) => {
            return null;
        });

        const xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: {timeUnit: 'minute', count: 1},
                renderer: am5xy.AxisRendererX.new(root, {
                    strokeOpacity: 0.1,
                    minorGridEnabled: true,
                    minGridDistance: 80,
                }),
            })
        );

        // Add series
        const series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                openValueXField: 'start',
                valueXField: 'end',
                categoryYField: 'category',
                sequencedInterpolation: true,
            })
        );

        series.columns.template.setAll({
            templateField: 'columnSettings',
            strokeOpacity: 1,
            stroke: am5.color(0x000000),
            tooltipText: `{task}:
[bold]{openValueX.formatDate('dd.MM.yyyy')}[/] - [bold]{valueX.formatDate('dd.MM.yyyy')}[/]
Приоритет: {priority}
{description}`,
        });

        // Filter data based on expanded state
        const filteredData = data.filter(item =>
            expandedEpics[item.epicId] ?? true
        );
        series.data.setAll(filteredData);

        // Add scrollbars
        chart.set('scrollbarX', am5.Scrollbar.new(root, {orientation: 'horizontal'}));

        // Make stuff animate on load
        series.appear();
        chart.appear(1000, 100);

        chartRef.current = root;

        return () => {
            if (chartRef.current) {
                chartRef.current.dispose();
            }
        };
    }, [expandedEpics, currentTheme, columns, epics, isLoading]);

    if (isLoading) {
        return <div className={styles.loading}>Загрузка данных...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                {epics.map(epic => (
                    <div
                        key={epic.id}
                        className={styles.epicItem}
                        onClick={() => toggleEpic(epic.id)}
                        style={{borderLeft: `4px solid ${epic.color}`}}
                    >
                        <div className={styles.epicTitle}>
                            {epic.title}
                            <span className={styles.toggleIcon}>
                {expandedEpics[epic.id] ? '−' : '+'}
              </span>
                        </div>
                    </div>
                ))}
            </div>
            <div id="chartdiv" className={styles.chartContainer}></div>
            <Toast ref={toast} />
        </div>
    );
};

export default GanttChart;