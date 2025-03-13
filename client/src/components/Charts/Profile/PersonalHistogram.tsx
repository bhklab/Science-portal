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
            if (chartData && chartRef.current) {
                // Determine the active dataset based on activeLegendItems.
                const activeDataset = chartData.datasets.find(
                    dataset => dataset.label && activeLegendItems.has(dataset.label)
                );
                // Use the active dataset's binLabels if available; otherwise, fallback.
                const newLabels = activeDataset?.binLabels || chartData.datasets[0]?.binLabels || [];

                // If a chart instance exists, destroy it to fully reset the configuration.
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const config: ChartConfiguration<'bar'> = {
                    type: 'bar',
                    data: {
                        labels: newLabels,
                        datasets: chartData.datasets.map(dataset => ({
                            ...dataset,
                            // Update hidden based on whether this dataset is active.
                            hidden: dataset.label ? !activeLegendItems.has(dataset.label) : false
                        }))
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        categoryPercentage: 1,
                        barPercentage: 1,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: tooltipItems => {
                                        const datasetIndex = tooltipItems[0].datasetIndex;
                                        const index = tooltipItems[0].dataIndex;
                                        // Use the active dataset's binLabels here as well.
                                        const labels = chartData.datasets[datasetIndex]?.binLabels || [];
                                        return labels[index] || '';
                                    },
                                    label: context => {
                                        const { dataset, parsed } = context;
                                        return `${parsed.y} scientists`;
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
                                    font: { size: 14 },
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
                                    text: 'Publications with Resources',
                                    color: '#000',
                                    font: { size: 14, weight: 'bold' }
                                },
                                grid: { display: false }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Total Scientists',
                                    color: '#000',
                                    font: { size: 14, weight: 'bold' }
                                },
                                beginAtZero: true
                            }
                        }
                    }
                };

                // Create a new chart instance with the updated configuration.
                chartInstance.current = new Chart(chartRef.current, config);
            }
        }, [chartData, activeLegendItems]);

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
