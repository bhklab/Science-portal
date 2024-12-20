import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Dataset {
    label: string;
    data: { x: number; y: number }[];
    backgroundColor?: string;
    borderColor?: string;
}

interface PersonalChartProps {
    chartData: any;
    enid: number;
}

export interface PersonalScatterPlotRef {
    downloadChartImage: (format: string) => void;
}

const PersonalScatterPlot = forwardRef<PersonalScatterPlotRef, PersonalChartProps>(({ chartData, enid }, ref) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    console.log(chartData);

    useEffect(() => {
        if (chartData && chartRef.current && !chartInstance.current) {
            chartInstance.current = new Chart(chartRef.current, {
                type: 'scatter',
                data: {
                    datasets: chartData.datasets
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: context => {
                                    const { dataset, dataIndex } = context;
                                    const point = dataset.data[dataIndex] as any;
                                    const highlight = point.backgroundColor === 'rgba(255, 99, 132, 0.8)';
                                    return highlight
                                        ? `👤 ${point.label} (Queried Author)`
                                        : `${point.label || `Point ${dataIndex}`}`;
                                }
                            }
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14
                                },
                                boxWidth: 16,
                                boxHeight: 16,
                                padding: 8,
                                useBorderRadius: true,
                                borderRadius: 2
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Rank in Institution',
                                color: '#000',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Publication Resources',
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
                    link.download = 'scatter-plot.png';
                } else if (format === 'jpeg') {
                    link.href = chartCanvas.toDataURL('image/jpeg');
                    link.download = 'scatter-plot.jpeg';
                }

                link.click();
            }
        }
    }));

    return <canvas ref={chartRef}></canvas>;
});

export default PersonalScatterPlot;
