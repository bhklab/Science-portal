import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, registerables } from 'chart.js';
import { ViolinController, ViolinElement, CategoryScale, LinearScale } from 'chartjs-chart-box-and-violin-plot';

Chart.register(...registerables, ViolinController, ViolinElement, CategoryScale, LinearScale);

interface Dataset {
    label: string;
    data: number[]; // Violin plots use an array of numerical values
    backgroundColor?: string;
    borderColor?: string;
}

interface PersonalChartProps {
    chartData: any;
    enid: number;
}

export interface PersonalViolinPlotRef {
    downloadChartImage: (format: string) => void;
}

const PersonalViolinPlot = forwardRef<PersonalViolinPlotRef, PersonalChartProps>(({ chartData, enid }, ref) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartData && chartRef.current && !chartInstance.current) {
            chartInstance.current = new Chart(chartRef.current, {
                type: 'violin',
                data: {
                    labels: chartData.labels, // X-axis labels (categories)
                    datasets: chartData.datasets // Dataset for violin plot
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: context => {
                                    const { dataset, dataIndex } = context;
                                    return `${dataset.label}: ${dataset.data[dataIndex]}`;
                                }
                            }
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Categories',
                                color: '#000',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Values',
                                color: '#000',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [chartData]);

    useImperativeHandle(ref, () => ({
        downloadChartImage: (format: string) => {
            if (chartInstance.current && chartRef.current) {
                const chartCanvas = chartRef.current;
                const link = document.createElement('a');

                if (format === 'png') {
                    link.href = chartInstance.current.toBase64Image();
                    link.download = 'violin-plot.png';
                } else if (format === 'jpeg') {
                    link.href = chartCanvas.toDataURL('image/jpeg');
                    link.download = 'violin-plot.jpeg';
                }

                link.click();
            }
        }
    }));

    return <canvas ref={chartRef}></canvas>;
});

export default PersonalViolinPlot;
