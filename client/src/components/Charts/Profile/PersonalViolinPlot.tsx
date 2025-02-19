import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';

interface Dataset {
    label: string;
    data: number[];
    pointBackgroundColor: string[];
    pointRadius: number[];
    labels: string[];
    enidList: number[];
    hidden?: boolean;
}

interface PersonalChartProps {
    chartData: {
        labels: string[];
        datasets: Dataset[];
    };
    activeLegendItems: Set<string>;
    enid: number;
}

export interface PersonalViolinPlotRef {
    downloadChartImage: (format: 'jpeg' | 'png' | 'webp' | 'svg') => void;
}

const PersonalViolinPlot = forwardRef<PersonalViolinPlotRef, PersonalChartProps>(
    ({ chartData, activeLegendItems, enid }, ref) => {
        const [plotData, setPlotData] = useState<any[]>([]);
        const [layout, setLayout] = useState<any>({});

        useEffect(() => {
            if (!chartData) return;

            // Violin traces (without points)
            const violinTraces = chartData.datasets
                .filter(dataset => activeLegendItems.has(dataset.label))
                .map(dataset => ({
                    type: 'violin',
                    x: dataset.data.map(() => dataset.label),
                    y: dataset.data,
                    name: dataset.label,
                    box: { visible: true },
                    meanline: { visible: true },
                    points: 'all',
                    scalemode: 'width',
                    hoverinfo: 'skip',
                    line: {
                        color: 'rgba(75, 192, 192, 1)',
                        width: 2
                    }
                }));

            // Regular scatter traces (all dots)
            const scatterTraces = chartData.datasets
                .filter(dataset => activeLegendItems.has(dataset.label))
                .map(dataset => ({
                    type: 'scatter',
                    mode: 'markers',
                    x: dataset.data.map(() => dataset.label),
                    y: dataset.data,
                    name: dataset.label,
                    text: dataset.labels,
                    hoverinfo: 'text',
                    scalemode: 'width',
                    points: 'all',
                    marker: {
                        size: dataset.pointRadius,
                        color: dataset.pointBackgroundColor,
                        opacity: 1
                    },
                    showlegend: false
                }));

            // Highlight scatter trace for the queried author
            const highlightedTraces = chartData.datasets
                .filter(dataset => activeLegendItems.has(dataset.label))
                .map(dataset => {
                    // Find indices where the queried author is present
                    const authorIndices = dataset.enidList
                        .map((id, idx) => (id === enid ? idx : -1))
                        .filter(idx => idx !== -1);

                    if (authorIndices.length === 0) return null; // Skip if no match

                    return {
                        type: 'scatter',
                        mode: 'markers',
                        x: authorIndices.map(idx => dataset.label),
                        y: authorIndices.map(idx => dataset.data[idx]),
                        text: authorIndices.map(idx => dataset.labels[idx]),
                        hoverinfo: 'text',
                        marker: {
                            size: authorIndices.map(() => 14),
                            color: authorIndices.map(() => 'rgba(255, 99, 132, 1)'),
                            line: { width: 2, color: 'rgba(255, 99, 132, 1)' }
                        },
                        name: 'Queried Author',
                        showlegend: false
                    };
                })
                .filter(trace => trace !== null); // Remove null traces

            setPlotData([...violinTraces, ...scatterTraces, ...highlightedTraces]);
            setLayout({
                title: '',
                xaxis: {
                    title: {
                        text: 'Resource Types',
                        font: { size: 14, color: '#000', family: 'Arial', weight: 'bold' }
                    },
                    showgrid: false,
                    zeroline: false,
                    tickangle: -45
                },
                yaxis: {
                    title: {
                        text: 'Publication Resources',
                        font: { size: 14, color: '#000', family: 'Arial', weight: 'bold' }
                    },
                    rangemode: 'tozero'
                },
                showlegend: true,
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    y: -0.4,
                    xanchor: 'center'
                }
            });
        }, [chartData, activeLegendItems, enid]);

        useImperativeHandle(ref, () => ({
            downloadChartImage: (format: 'jpeg' | 'png' | 'webp' | 'svg') => {
                const filename = `violin-plot.${format}`;
                Plotly.downloadImage(document.getElementById('violin-plot') as HTMLElement, {
                    format,
                    filename,
                    width: 800,
                    height: 800
                });
            }
        }));

        return (
            <Plot
                data={plotData}
                layout={layout}
                config={{ displayModeBar: false }}
                style={{ width: '100%', height: '100%' }}
                divId="violin-plot"
            />
        );
    }
);

export default PersonalViolinPlot;
