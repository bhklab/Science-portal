import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ExportDropdown } from '../components/DropdownButtons/ExportDropdown';
import { FilterDropdown } from '../components/DropdownButtons/FilterDropdown';
import AnnualChart, { AnnualChartRef } from '../components/Charts/StatisticsPage/AnnualChart';
import { AuthContext } from 'hooks/AuthContext';

const Analytics: React.FC = () => {
    const [chartData, setChartData] = useState<any | null>(null);

    // Resource type filtering state variables
    const [legendItems, setLegendItems] = useState<string[]>([]);
    const [activeLegendItems, setActiveLegendItems] = useState(new Set<string>());

    // Years filter state variables
    const [minMaxYear, setMinMaxYear] = useState<{ minYear: number | null; maxYear: number | null }>({
        minYear: null,
        maxYear: null
    });
    const [yearRange, setYearRange] = useState<[number, number] | null>(null);

    const chartRef = useRef<AnnualChartRef>(null);
    const authContext = useContext(AuthContext);

    // Keep name: toggleLegendItem (legend only)
    const toggleLegendItem = (item: string, _chartType: string) => {
        setActiveLegendItems(prev => {
            const next = new Set(prev);
            if (next.has(item)) next.delete(item);
            else next.add(item);
            return next;
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
                const res = await axios.post('/api/stats/supplementary', { email: authContext?.user?.email });
                setChartData(res.data);

                // Legend items from datasets
                const labels = res.data.datasets.map((dataset: any) => dataset.label);
                setLegendItems(labels);
                setActiveLegendItems(new Set(labels)); // all active by default

                // Years from x-axis labels
                const years = (res.data.labels as (string | number)[]) || [];

                // Normalize numbers for slider logic
                const numericYears = years
                    .map(y => (typeof y === 'string' ? parseInt(y, 10) : y))
                    .filter(y => !Number.isNaN(y)) as number[];

                if (numericYears.length > 0) {
                    const yMin = Math.min(...numericYears);
                    const yMax = Math.max(...numericYears);
                    setMinMaxYear({
                        minYear: yMin,
                        maxYear: yMax
                    });
                    setYearRange([yMin, yMax]);
                } else {
                    setMinMaxYear({
                        minYear: null,
                        maxYear: null
                    });
                    setYearRange(null);
                }
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };
        getChartData();
    }, []);

    // Filter data by legend + yearRange
    const filteredChartData = useMemo(() => {
        if (!chartData) return null;

        // If no slider yet, show original
        if (!yearRange || minMaxYear.minYear === null || minMaxYear.maxYear === null) {
            const datasets = chartData.datasets.filter((ds: any) => activeLegendItems.has(ds.label));
            return { ...chartData, datasets };
        }

        const [low, high] = yearRange;

        // Determine which label indices to keep based on year range (inclusive)
        const keepIdx: number[] = [];
        chartData.labels.forEach((lbl: string | number, i: number) => {
            const yr = typeof lbl === 'string' ? parseInt(lbl, 10) : lbl;
            if (!Number.isNaN(yr) && typeof yr === 'number' && yr >= low && yr <= high) {
                keepIdx.push(i);
            }
        });

        const filteredLabels = keepIdx.map((i: number) => chartData.labels[i]);

        const filteredDatasets = chartData.datasets
            .filter((ds: any) => activeLegendItems.has(ds.label))
            .map((ds: any) => ({
                ...ds,
                data: keepIdx.map((i: number) => ds.data[i])
            }));

        return {
            ...chartData,
            labels: filteredLabels,
            datasets: filteredDatasets
        };
    }, [chartData, activeLegendItems, yearRange, minMaxYear]);

    return (
        <div className="py-20 px-32 md:px-6">
            <div className="flex flex-col px-10 sm:px-2 gap-3 bg-white border-1 border-gray-200 rounded-md pb-10">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col gap-1 py-10 xs:max-w-[60%]">
                        <h1 className="text-heading2Xl sm:text-headingLg xs:text-headingMd font-semibold">
                            Princess Margaret Cancer Centre Resource Statistics
                        </h1>
                        <p className="text-bodySm sm:text-bodyXs text-gray-500">
                            Total publications that share resources
                        </p>
                    </div>

                    <div className="flex flex-row sm:flex-col xs:items-end gap-4">
                        <FilterDropdown
                            legendItems={legendItems}
                            activeItems={activeLegendItems}
                            toggleLegendItem={toggleLegendItem}
                            chartType="legend"
                            minYear={minMaxYear.minYear ?? undefined}
                            maxYear={minMaxYear.maxYear ?? undefined}
                            yearRange={yearRange ?? undefined}
                            onYearRangeChange={setYearRange}
                        />
                        <ExportDropdown onDownload={downloadChartImage} chartType="bar" />
                    </div>
                </div>
                {filteredChartData ? (
                    <div className="chart-container relative w-full" style={{ height: '700px' }}>
                        <AnnualChart
                            ref={chartRef}
                            chartData={filteredChartData}
                            activeLegendItems={activeLegendItems}
                        />
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
