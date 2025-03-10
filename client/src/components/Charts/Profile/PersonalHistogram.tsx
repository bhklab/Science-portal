// PersonalHistogram.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Chart, ChartDataset, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface CustomBarDataset extends ChartDataset<'bar'> {
    binLabels?: string[];
}

interface PersonalHistogramProps {
    chartData: {
        datasets: CustomBarDataset[];
    };
    activeLegendItems: Set<string>;
}

export interface PersonalHistogramRef {
    downloadChartImage: (format: string) => void;
}

const PersonalHistogram = forwardRef<PersonalHistogramRef, PersonalHistogramProps>(
    ({ chartData, activeLegendItems }, ref) => {
        const chartRef = useRef<HTMLCanvasElement>(null);
        const chartInstance = useRef<Chart<'bar'> | null>(null);

        useEffect(() => {
            if (chartData && chartRef.current && !chartInstance.current) {
                // Create chart configuration
                const config: ChartConfiguration<'bar'> = {
                    type: 'bar',
                    data: {
                        labels: chartData.datasets[0]?.binLabels || [],
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
                                    title: tooltipItems => {
                                        const datasetIndex = tooltipItems[0].datasetIndex;
                                        const index = tooltipItems[0].dataIndex;
                                        return chartData.datasets[datasetIndex]?.binLabels?.[index] || '';
                                    },
                                    label: context => {
                                        const { dataset, parsed } = context;
                                        return `${dataset.label}: ${parsed.y} authors`;
                                    },
                                    footer: tooltipItems => {
                                        const datasetIndex = tooltipItems[0].datasetIndex;
                                        const index = tooltipItems[0].dataIndex;
                                        const isUserBin =
                                            Array.isArray(chartData.datasets[datasetIndex]?.backgroundColor) &&
                                            chartData.datasets[datasetIndex]?.backgroundColor[index] ===
                                                'rgba(255, 99, 132, 1)';
                                        return isUserBin ? 'Your contribution range' : '';
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
                                onClick: null // Disable default legend click behavior
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Number of Publications with Resources',
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
                                title: {
                                    display: true,
                                    text: 'Number of Scientists',
                                    color: '#000',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                },
                                beginAtZero: true
                            }
                        }
                    }
                };

                chartInstance.current = new Chart(chartRef.current, config);
            }
        }, [chartData]);

        // Update chart when legend selections change
        useEffect(() => {
            if (chartInstance.current && chartData) {
                chartInstance.current.data.datasets.forEach(dataset => {
                    if (dataset.label) {
                        dataset.hidden = !activeLegendItems.has(dataset.label);
                    }
                });
                chartInstance.current.update();
            }
        }, [activeLegendItems]);

        // Expose download method through ref
        useImperativeHandle(ref, () => ({
            downloadChartImage: (format: string) => {
                if (chartInstance.current && chartRef.current) {
                    const chartCanvas = chartRef.current;
                    const link = document.createElement('a');

                    if (format === 'png') {
                        link.href = chartInstance.current.toBase64Image();
                        link.download = 'contribution-histogram.png';
                    } else if (format === 'jpeg') {
                        link.href = chartCanvas.toDataURL('image/jpeg');
                        link.download = 'contribution-histogram.jpeg';
                    } else if (format === 'svg') {
                        // For SVG, would need additional libraries
                        console.warn('SVG export is not supported natively');
                        return;
                    }
                    link.click();
                }
            }
        }));

        return <canvas ref={chartRef}></canvas>;
    }
);

export default PersonalHistogram;
