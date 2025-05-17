import {Chart} from "primereact/chart";
import {useState, useRef} from "react";
import styles from './Metrics.module.scss'
import { Calendar } from 'primereact/calendar';
import "primeicons/primeicons.css";

interface MetricsProps {
    boardId: string;
}

const Metrics = ({ boardId }: MetricsProps) => {

    console.log(boardId);

    const [chartType, setChartType] = useState<'stacked' | 'line'>('stacked');
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    const [stackedData] = useState({
        labels: [
            '7.04', '8.04', '9.04', '10.04', '11.04', '12.04', '13.04', '14.04', '15.04', '16.04', '17.04', '18.04', '19.04', '20.04', '21.04', '22.04'
        ],
        datasets: [{
            type: 'bar',
            label: 'Новые',
            backgroundColor: '#00E8F0',
            data: [
                6, 12, 42, 50, 90, 25, 76, 48,
                65, 82, 34, 56, 78, 92, 45, 67
            ],
            barPercentage: 0.3,
        }, {
            type: 'bar',
            label: 'В процессе',
            backgroundColor: '#009883',
            data: [
                20, 24, 34, 41, 37, 84, 65, 75,
                58, 43, 67, 89, 52, 38, 71, 63
            ],
            barPercentage: 0.3,
        }, {
            type: 'bar',
            label: 'Готово',
            backgroundColor: '#A8F000',
            data: [
                22, 24, 32, 41, 23, 52, 34, 74,
                61, 48, 72, 55, 83, 67, 42, 59
            ],
            barPercentage: 0.3,
        }]
    });

    const [lineData] = useState({
        labels: [
            '7.04', '8.04', '9.04', '10.04', '11.04', '12.04', '13.04', '14.04', '15.04', '16.04', '17.04', '18.04', '19.04', '20.04', '21.04', '22.04'
        ],
        datasets: [{
            type: 'line',
            label: 'Новые',
            borderColor: '#00E8F0',
            backgroundColor: 'rgba(0, 232, 240, 0.2)',
            fill: true,
            tension: 0.4,
            data: [
                6, 12, 42, 50, 90, 25, 76, 48,
                65, 82, 34, 56, 78, 92, 45, 67
            ],
        }, {
            type: 'line',
            label: 'В процессе',
            borderColor: '#009883',
            backgroundColor: 'rgba(0, 152, 131, 0.2)',
            fill: true,
            tension: 0.4,
            data: [
                20, 24, 34, 41, 37, 84, 65, 75,
                58, 43, 67, 89, 52, 38, 71, 63
            ],
        }, {
            type: 'line',
            label: 'Готово',
            borderColor: '#A8F000',
            backgroundColor: 'rgba(168, 240, 0, 0.2)',
            fill: true,
            tension: 0.4,
            data: [
                22, 24, 32, 41, 23, 52, 34, 74,
                61, 48, 72, 55, 83, 67, 42, 59
            ],
        }]
    });

    const [filteredStackedData, setFilteredStackedData] = useState(stackedData);
    const [filteredLineData, setFilteredLineData] = useState(lineData);

    const getLightTheme = () => {
        const stackedOptions = {
            maintainAspectRatio: false,
            aspectRatio: .5,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            className: 'chart-legend-text'
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        font: {
                            className: 'chart-axis-text'
                        }
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        font: {
                            className: 'chart-axis-text'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            bar: {
                categoryPercentage: 0.4,
                barPercentage: 0.8
            }
        };

        const lineOptions = {
            maintainAspectRatio: false,
            aspectRatio: .5,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            className: 'chart-legend-text'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            className: 'chart-axis-text'
                        }
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    ticks: {
                        font: {
                            className: 'chart-axis-text'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        };

        return {
            stackedOptions,
            lineOptions
        }
    }

    const {stackedOptions, lineOptions} = getLightTheme();

    const handleDateChange = (e: { value: Date[] | null }) => {
        setDateRange(e.value);

        if (e.value && e.value.length === 2) {
            const [startDate, endDate] = e.value;

            // Преобразуем даты в формат 'dd.mm' для сравнения с labels
            const formatForComparison = (date: Date) => {
                return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            };

            const startStr = formatForComparison(startDate);
            const endStr = formatForComparison(endDate);

            // Фильтруем labels и соответствующие данные
            const filterData = (originalData: typeof stackedData) => {
                const filteredLabels = originalData.labels.filter(label => {
                    const [day, month] = label.split('.');
                    const labelDate = new Date();
                    labelDate.setFullYear(new Date().getFullYear()); // Устанавливаем текущий год
                    labelDate.setDate(parseInt(day));
                    labelDate.setMonth(parseInt(month) - 1);

                    return labelDate >= startDate && labelDate <= endDate;
                });

                const labelIndices = filteredLabels.map(label =>
                    originalData.labels.indexOf(label)
                );

                return {
                    labels: filteredLabels,
                    datasets: originalData.datasets.map(dataset => ({
                        ...dataset,
                        data: labelIndices.map(i => dataset.data[i])
                    }))
                };
            };

            setFilteredStackedData(filterData(stackedData));
            setFilteredLineData(filterData(lineData));
        } else {
            // Если диапазон не выбран, показываем все данные
            setFilteredStackedData(stackedData);
            setFilteredLineData(lineData);
        }

        setShowCalendar(false);
    };

    const formatDateRange = () => {
        if (!dateRange || dateRange.length < 2) return 'Выберите период';

        const startDate = dateRange[0];
        const endDate = dateRange[1];

        if (startDate && endDate) {
            return `${startDate.toLocaleDateString('ru-RU')} - ${endDate.toLocaleDateString('ru-RU')}`;
        }

        return 'Выберите период';
    };

    return (
        <div className={styles.card}>
            <div className={styles.chartControls}>
                <div className={styles.chartToggle}>
                    <button
                        className={`${styles.toggleButton} ${chartType === 'stacked' ? styles.active : ''}`}
                        onClick={() => setChartType('stacked')}
                    >
                        Накопительная диаграмма
                    </button>
                    <button
                        className={`${styles.toggleButton} ${chartType === 'line' ? styles.active : ''}`}
                        onClick={() => setChartType('line')}
                    >
                        Контрольная диаграмма
                    </button>
                </div>

                <div className={styles.datePickerContainer} ref={calendarRef}>
                    <div
                        className={styles.datePickerButton}
                        onClick={() => setShowCalendar(!showCalendar)}
                    >
                        <i className="pi pi-calendar" />
                        <span>{formatDateRange()}</span>
                    </div>

                    {showCalendar && (
                        <div className={styles.calendarOverlay} onClick={() => setShowCalendar(false)}>
                            <div className={styles.calendar} onClick={e => e.stopPropagation()}>
                                <Calendar
                                    value={dateRange}
                                    onChange={(e) => handleDateChange(e as { value: Date[] | null })}
                                    selectionMode="range"
                                    readOnlyInput
                                    inline
                                    dateFormat="dd.mm.yy"
                                    showButtonBar
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {chartType === 'stacked' ? (
                <Chart type="bar" data={filteredStackedData} options={stackedOptions}/>
            ) : (
                <Chart type="line" data={filteredLineData} options={lineOptions}/>
            )}
        </div>
    );
};

export default Metrics;