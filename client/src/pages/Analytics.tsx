import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ExportDropdown } from '../components/DropdownButtons/ExportDropdown';
import { FilterDropdown } from '../components/DropdownButtons/FilterDropdown';
import AnnualChart, { AnnualChartRef } from '../components/Charts/StatisticsPage/AnnualChart';

const Analytics: React.FC = () => {
    const [chartData, setChartData] = useState<any | null>(null);
    const [legendItems, setLegendItems] = useState<string[]>([]);
    const [activeLegendItems, setActiveLegendItems] = useState(new Set<string>());
    const chartRef = useRef<AnnualChartRef>(null);

    const toggleLegendItem = (item: string) => {
        setActiveLegendItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(item)) newSet.delete(item);
            else newSet.add(item);
            return newSet;
        });
    };

    const downloadChartImage = (format: string) => {
        if (chartRef.current) {
            chartRef.current.downloadChartImage(format);
        }
    };

    useEffect(() => {
        const getChartData = async () => {
            try {
                const res = await axios.get('/api/stats/supplementary');
                setChartData(res.data);

                // Extract legend items (dataset labels) dynamically
                const labels = res.data.datasets.map((dataset: any) => dataset.label);
                setLegendItems(labels);
                setActiveLegendItems(new Set(labels)); // Initialize all items as active
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };
        getChartData();
    }, []);

    return (
        <div className="py-20 px-32 md:px-6">
            <div className="flex flex-col px-10 gap-3 md:px-10 sm:px-0 bg-white border-1 border-gray-200 rounded-md">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-heading2Xl font-semibold py-10">Princess Margaret Cancer Centre Statistics</h1>
                    <div className="flex flex-row gap-4">
                        <FilterDropdown
                            legendItems={legendItems}
                            activeItems={activeLegendItems}
                            toggleLegendItem={toggleLegendItem}
                        />
                        <ExportDropdown onDownload={downloadChartImage} />
                    </div>
                </div>
                {chartData ? (
                    <div className="chart-container relative w-full" style={{ height: '700px' }}>
                        <AnnualChart ref={chartRef} chartData={chartData} activeLegendItems={activeLegendItems} />
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
