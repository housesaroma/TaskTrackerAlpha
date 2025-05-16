import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import styles from './GanttChart.module.scss';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';
import {INITIAL_COLUMNS, INITIAL_EPICS} from '../../constants/mock-data';
import am5locales_ru_RU from "@amcharts/amcharts5/locales/ru_RU";

interface GanttChartProps {
}

const GanttChart = ({}: GanttChartProps) => {
    const chartRef = useRef<am5.Root | null>(null);
    const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>({});
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

    const toggleEpic = (epicId: string) => {
        setExpandedEpics(prev => ({
            ...prev,
            [epicId]: !prev[epicId]
        }));
    };

    useEffect(() => {
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
        const allCards = INITIAL_COLUMNS.flatMap(column => column.cards);
        const cardsWithEpics = allCards.filter(card => card.epicId);
        const cardsWithoutEpics = allCards.filter(card => !card.epicId);

        // Group cards by epic
        const epicGroups: Record<string, any[]> = {};
        INITIAL_EPICS.forEach(epic => {
            epicGroups[epic.id] = cardsWithEpics.filter(card => card.epicId === epic.id);
        });
        epicGroups['no-epic'] = cardsWithoutEpics;

        // Prepare data for chart
        const data = Object.entries(epicGroups).flatMap(([epicId, cards]) => {
            return cards
                .filter(card => card.startDate && card.endDate)
                .map(card => {
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

                    const epic = INITIAL_EPICS.find(e => e.id === card.epicId);
                    const color = epic ? epic.color! : '#CCCCCC';

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
            ...INITIAL_EPICS.map(epic => ({
                category: epic.id,
                name: epic.title,
                color: epic.color
            })),
            {
                category: 'no-epic',
                name: 'Без эпика',
                color: '#CCCCCC'
            }
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
    }, [expandedEpics, currentTheme]);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                {INITIAL_EPICS.map(epic => (
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
                <div
                    className={styles.epicItem}
                    onClick={() => toggleEpic('no-epic')}
                    style={{borderLeft: '4px solid #CCCCCC'}}
                >
                    <div className={styles.epicTitle}>
                        Без эпика
                        <span className={styles.toggleIcon}>
              {expandedEpics['no-epic'] ? '−' : '+'}
            </span>
                    </div>
                </div>
            </div>
            <div id="chartdiv" className={styles.chartContainer}></div>
        </div>
    );
};

export default GanttChart;