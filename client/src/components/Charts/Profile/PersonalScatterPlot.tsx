// PersonalScatterPlot.tsx
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
                        ...chartData,
                        datasets: chartData.datasets.map(dataset => ({
                            ...dataset,
                            // Toggle visibility based on activeLegendItems
                            hidden: dataset.label ? !activeLegendItems.has(dataset.label) : false
                        }))
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: context => {
                                        const { dataset, dataIndex } = context;
                                        const point = dataset.data[dataIndex] as any;
                                        return point.label || `Point ${dataIndex}`;
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
                                onClick: () => ({})
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

                    const ctx = chartCanvas.getContext('2d');
                    if (format === 'jpeg') {
                        if (ctx) {
                            ctx.save();
                            ctx.globalCompositeOperation = 'destination-over'; // send colour to back
                            ctx.fillStyle = '#ffffff'; // set colour to white
                            ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height); // set colour box to conver entire canvas
                            link.href = chartCanvas.toDataURL('image/jpeg');
                            link.download = 'chart-image.jpeg';
                            ctx.restore();
                        }
                    } else if (format === 'png') {
                        if (ctx) {
                            ctx.save();
                            ctx.fillStyle = 'rgb(0, 0, 0, 0.01)';
                            link.href = chartCanvas.toDataURL('image/png');
                            link.download = 'chart-image.png';
                            ctx.restore();
                        }
                    }
                    link.click();
                }
            }
        }));

        return <canvas ref={chartRef}></canvas>;
    }
);

export default PersonalScatterPlot;
