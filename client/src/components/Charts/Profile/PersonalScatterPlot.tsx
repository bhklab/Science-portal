import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, ChartDataset, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface PersonalChartProps {
    chartData: {
        datasets: ChartDataset<'scatter'>[];
    };
    enid: number;
    activeLegendItems: Set<string>;
}

export interface PersonalScatterPlotRef {
    downloadChartImage: (format: string) => void;
}

const PersonalScatterPlot = forwardRef<PersonalScatterPlotRef, PersonalChartProps>(
    ({ chartData, enid, activeLegendItems }, ref) => {
        const chartRef = useRef<HTMLCanvasElement>(null);
        const chartInstance = useRef<Chart<'scatter'> | null>(null);

        useEffect(() => {
            if (chartData && chartRef.current && !chartInstance.current) {
                const config: ChartConfiguration<'scatter'> = {
                    type: 'scatter',
                    data: {
                        datasets: chartData.datasets.map(dataset => ({
                            ...dataset,
                            hidden: dataset.label ? !activeLegendItems.has(dataset.label) : false
                        }))
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
                                },
                                onClick: null
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Institution Rank',
                                    color: '#000',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                },
                                grid: {
                                    display: false
                                },
                                reverse: true
                            },
                            y: {
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
                };

                chartInstance.current = new Chart(chartRef.current, config);
            }
        }, [chartData]);

        useEffect(() => {
            if (chartInstance.current) {
                chartInstance.current.data.datasets.forEach(dataset => {
                    if (dataset.label) {
                        dataset.hidden = !activeLegendItems.has(dataset.label);
                    }
                });
                chartInstance.current.update();
            }
        }, [activeLegendItems]);

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
    }
);

export default PersonalScatterPlot;
