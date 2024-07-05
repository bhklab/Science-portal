import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import ResizeObserver from 'resize-observer-polyfill';

Chart.register(...registerables);

const data = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
        {
            label: 'Github',
            backgroundColor: 'rgba(255,99,132,0.5)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 20, 25]
        },
        {
            label: 'Code Ocean',
            backgroundColor: 'rgba(54,162,235,0.5)',
            borderColor: 'rgba(54,162,235,1)',
            borderWidth: 1,
            data: [28, 48, 40, 19, 86, 21, 22]
        },
        {
            label: 'Gitlab',
            backgroundColor: 'rgba(75,192,192,0.5)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            data: [12, 33, 45, 67, 78, 14, 2]
        },
        {
            label: 'Geo',
            backgroundColor: 'purple',
            borderColor: 'purple',
            borderWidth: 1,
            data: [3, 10, 21, 17, 16, 40, 22]
        },
        {
            label: 'Clinical Trials',
            backgroundColor: 'black',
            borderColor: 'black',
            borderWidth: 1,
            data: [30, 29, 17, 45, 12, 21, 10]
        }
    ]
};

const options = {
    plugins: {
        title: {
            display: true,
            text: 'Number of Links by Year and Type'
        },
        tooltip: {
            mode: 'index' as const,
            intersect: false
        },
        legend: {
            position: 'top' as const
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            stacked: true,
            title: {
                display: true,
                text: 'Years'
            }
        },
        y: {
            stacked: true,
            title: {
                display: true,
                text: '# of Links'
            }
        }
    }
};

const Analytics: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const [chartData, setChartData] = useState<any | null>(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const getChartData = async () => {
            try {
                const res = await axios.get('/api/stats/supplementary');
                setChartData(res);
            } catch (error) {}
            if (chartRef.current) {
                chartInstance.current = new Chart(chartRef.current, {
                    type: 'bar',
                    data: data,
                    options: options
                });
            }
        };
        getChartData();
    });

    return (
        <div className="pt-16">
            <h1 className="text-heading2Xl text-center font-bold py-10">Analytics</h1>
            <div className="flex flex-col px-60 md:px-10 sm:px-0">
                {data ? (
                    <div className="chart-container relative w-full" style={{ height: '400px' }} ref={containerRef}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                ) : (
                    <div className="flex justify-content-center items-center">
                        <ProgressSpinner
                            style={{ width: '200px', height: '200px' }}
                            strokeWidth="4"
                            fill="var(--surface-ground)"
                            animationDuration="1s"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
