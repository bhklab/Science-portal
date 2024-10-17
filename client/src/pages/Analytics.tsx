import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import ResizeObserver from 'resize-observer-polyfill';

Chart.register(...registerables);

interface Lab {
    name: string;
    firstName: string;
    lastName: string;
}

interface Author {
    firstName: string;
    lastName: string;
    email: string;
    primaryAppointment: string;
    primaryResearchInstitute: string;
    secondaryAppointment: string | null;
    secondaryResearchInstitute: string | null;
    ENID: number;
}

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
                text: 'Supplementary Data'
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
                chartInstance.current = null;
            }
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const getChartData = async () => {
            try {
                const res = await axios.get('/api/stats/supplementary');
                setChartData(res.data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };
        getChartData();
    }, []);

    useEffect(() => {
        if (chartData && chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: chartData,
                options: options
            });
        }
    }, [chartData]);

    return (
        <div className="pt-16">
            <h1 className="text-heading2Xl text-center font-bold py-10">Analytics</h1>
            <div className="flex flex-col px-60 gap-3 md:px-10 sm:px-0">
                <h2 className="text-headingXl font-bold py-10">Supplementary Data</h2>
                {chartData ? (
                    <div className="chart-container relative w-full" style={{ height: '700px' }} ref={containerRef}>
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
