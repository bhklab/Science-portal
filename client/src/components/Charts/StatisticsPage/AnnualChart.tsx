import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface AnnualChartProps {
    chartData: any;
    activeLegendItems: Set<string>;
}

export interface AnnualChartRef {
    downloadChartImage: (format: string) => void;
}

const AnnualChart = forwardRef<AnnualChartRef, AnnualChartProps>(({ chartData, activeLegendItems }, ref) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartData && chartRef.current && !chartInstance.current) {
            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    ...chartData,
                    datasets: chartData.datasets.map((dataset: any) => ({
                        ...dataset,
                        hidden: !activeLegendItems.has(dataset.label)
                    }))
                },
                options: {
                    plugins: {
                        title: {
                            display: false,
                            text: 'Princess Margaret Cancer Centre Statistics'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
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
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Year',
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

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.data.datasets.forEach((dataset: any) => {
                dataset.hidden = !activeLegendItems.has(dataset.label);
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
                    link.download = 'chart-image.png';
                } else if (format === 'jpeg') {
                    link.href = chartCanvas.toDataURL('image/jpeg');
                    link.download = 'chart-image.jpeg';
                }

                link.click();
            }
        }
    }));

    return <canvas ref={chartRef}></canvas>;
});

export default AnnualChart;
