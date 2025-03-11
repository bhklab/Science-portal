import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);

interface Dataset {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    hidden?: boolean;
}

interface PersonalChartProps {
    chartData: any;
    activeLegendItems: Set<string>;
}

export interface PersonalBarChartRef {
    downloadChartImage: (format: string) => void;
}

const PersonalBarChart = forwardRef<PersonalBarChartRef, PersonalChartProps>(
    ({ chartData, activeLegendItems }, ref) => {
        const chartRef = useRef<HTMLCanvasElement>(null);
        const chartInstance = useRef<Chart | null>(null);

        useEffect(() => {
            if (chartData && chartRef.current && !chartInstance.current) {
                // Calculate the max for stacked bars
                const stackedMax = chartData.labels.map((_: any, index: number) =>
                    chartData.datasets.reduce((sum: number, dataset: Dataset) => {
                        if (!dataset.hidden) {
                            return sum + (dataset.data[index] || 0);
                        }
                        return sum;
                    }, 0)
                );

                const maxDataValue = Math.max(...stackedMax);
                const buffer = 2; // Adjust buffer size as needed

                chartInstance.current = new Chart(chartRef.current, {
                    type: 'bar',
                    data: {
                        ...chartData,
                        datasets: chartData.datasets.map((dataset: any) => ({
                            ...dataset,
                            hidden: !activeLegendItems.has(dataset.label)
                        }))
                    },
                    plugins: [ChartDataLabels],
                    options: {
                        plugins: {
                            title: {
                                display: false,
                                text: 'My Publication Statistics'
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
                                },
                                onClick: null
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'top',
                                color: '#000000',
                                formatter: (value, context) => {
                                    const datasetArray: any = [];
                                    context.chart.data.datasets.forEach((dataset, datasetIndex) => {
                                        // Check if the dataset is visible
                                        if (context.chart.isDatasetVisible(datasetIndex)) {
                                            const datapoint = dataset.data[context.dataIndex];
                                            if (datapoint !== undefined) {
                                                datasetArray.push(datapoint);
                                            }
                                        }
                                    });

                                    // Calculate the total sum of visible data points
                                    const totalSum = datasetArray.reduce(
                                        (total: number, datapoint: any) => total + datapoint,
                                        0
                                    );

                                    // Display the sum only for the last visible dataset
                                    const visibleDatasets = context.chart.data.datasets.filter((_, datasetIndex) =>
                                        context.chart.isDatasetVisible(datasetIndex)
                                    );

                                    if (
                                        context.datasetIndex ===
                                        context.chart.data.datasets.findIndex(
                                            dataset => dataset === visibleDatasets[visibleDatasets.length - 1]
                                        )
                                    ) {
                                        return totalSum;
                                    }
                                    return '';
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
                                // max: maxDataValue + buffer //Make the y-axis add a buffer and also makes it static
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
    }
);

export default PersonalBarChart;
