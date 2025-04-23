import {Chart} from "primereact/chart";
import {useState} from "react";
import styles from './Metrics.module.scss'

interface MetricsProps {
}

const Metrics = ({}: MetricsProps) => {
    const [stackedData] = useState({
        labels: ['7 - 13.04', '14 - 20.04', '21 - 27.04', '28 - 4.05', '5 - 11.05', '12 - 18.04', '19 - 25.04', '26 - 1.06'],
        datasets: [{
            type: 'bar',
            label: 'Новые',
            backgroundColor: '#00E8F0',
            data: [
                6,
                12,
                42,
                50,
                90,
                25,
                76,
                48,
            ],
            barPercentage: 0.3,
        }, {
            type: 'bar',
            label: 'В процессе',
            backgroundColor: '#009883',
            data: [
                20,
                24,
                34,
                41,
                37,
                84,
                65,
                75,
            ],
            barPercentage: 0.3,
        }, {
            type: 'bar',
            label: 'Готово',
            backgroundColor: '#A8F000',
            data: [
                22,
                24,
                32,
                41,
                23,
                52,
                34,
                74,
            ],
            barPercentage: 0.3,
        }]
    });

    const getLightTheme = () => {
        let stackedOptions = {
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
                        color: '#495057',
                        boxWidth: 12,
                        padding: 20,
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        display: false
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        display: false
                    }
                }
            },        bar: {
                categoryPercentage: 0.4,
                barPercentage: 0.8
            }
        };

        return {
            stackedOptions,
        }
    }

    const {stackedOptions} = getLightTheme();


    return <div className={styles.card}>
        <Chart type="bar" data={stackedData} options={stackedOptions}/>
    </div>;
};

export default Metrics;