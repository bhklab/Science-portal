import React, { useEffect, useContext, useRef, useState, useMemo } from 'react';
import { AuthContext } from 'hooks/AuthContext';
import AnnualChart, { AnnualChartRef } from '../components/Charts/StatisticsPage/AnnualChart';
import { FilterDropdown } from '../components/DropdownButtons/FilterDropdown';
import { ExportDropdown } from '../components/DropdownButtons/ExportDropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';

const Admin: React.FC = () => {
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

    const buildCSVFromChartData = (data: any): string => {
        if (!data || !Array.isArray(data.labels) || !Array.isArray(data.datasets)) return '';

        const lines: string[] = [];
        lines.push('year,category,value');

        const labels = data.labels;
        data.datasets.forEach((ds: any) => {
            const cat = String(ds?.label ?? '');
            const arr = Array.isArray(ds?.data) ? ds.data : [];
            for (let i = 0; i < labels.length; i++) {
                const yearRaw = labels[i];
                const year = typeof yearRaw === 'string' ? yearRaw : String(yearRaw);
                const val = Number(arr[i] ?? 0);
                // escape category if needed
                const catEsc = /[",\n]/.test(cat) ? `"${cat.replace(/"/g, '""')}"` : cat;
                const yearEsc = /[",\n]/.test(year) ? `"${year.replace(/"/g, '""')}"` : year;
                lines.push(`${yearEsc},${catEsc},${val}`);
            }
        });

        return lines.join('\n');
    };

    const triggerCSVDownload = (csv: string, filename: string) => {
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadCSV = (scope: 'filtered' | 'full' = 'filtered') => {
        const data = scope === 'filtered' ? filteredChartData : chartData;
        if (!data) return;

        const csv = buildCSVFromChartData(data);
        const ts = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const fname =
            scope === 'filtered' ? `supplementary_stats_filtered_${ts}.csv` : `supplementary_stats_full_${ts}.csv`;

        triggerCSVDownload(csv, fname);
    };

    useEffect(() => {
        const getChartData = async () => {
            try {
                const res = await axios.post('/api/stats/supplementary', { email: authContext?.user?.email });

                // Labels to merge → Source Code
                const MERGE_LABELS = ['code', 'containers', 'packages'];
                const isMergeTarget = (lbl: unknown) =>
                    MERGE_LABELS.includes(
                        String(lbl ?? '')
                            .trim()
                            .toLowerCase()
                    );

                const input = res.data ?? { labels: [], datasets: [] };
                const allDatasets = Array.isArray(input.datasets) ? input.datasets : [];
                const xLabels = Array.isArray(input.labels) ? input.labels : [];

                // Split datasets
                const mergeParts = allDatasets.filter((d: any) => isMergeTarget(d?.label));
                const keepParts = allDatasets.filter((d: any) => !isMergeTarget(d?.label));

                let transformed = input;

                if (mergeParts.length > 0) {
                    // Element-wise sum across the data arrays
                    const L = xLabels.length;
                    const summed = new Array(L).fill(0);
                    mergeParts.forEach((ds: any) => {
                        const arr = Array.isArray(ds?.data) ? ds.data : [];
                        for (let i = 0; i < L; i++) {
                            const v = Number(arr[i] ?? 0);
                            if (!Number.isNaN(v)) summed[i] += v;
                        }
                    });

                    // Use first merged dataset as a visual base (optional)
                    const base = mergeParts[0] || {};
                    const sourceCodeDataset = {
                        ...base,
                        label: 'Source Code',
                        data: summed
                    };

                    transformed = {
                        ...input,
                        datasets: [sourceCodeDataset, ...keepParts]
                    };
                } else {
                    // If nothing to merge but you still want any stray labels normalized:
                    transformed = {
                        ...input,
                        datasets: allDatasets.map((d: any) =>
                            isMergeTarget(d?.label) ? { ...d, label: 'Source Code' } : d
                        )
                    };
                }

                // Save chart data
                setChartData(transformed);
                console.log('Transformed data:', transformed);

                // Rebuild legend labels from transformed datasets (deduped)
                const legend = Array.from(
                    new Set((transformed.datasets || []).map((d: any) => String(d?.label ?? '')))
                );
                setLegendItems(legend);
                setActiveLegendItems(new Set(legend)); // all active by default

                // Years from x-axis labels (unchanged)
                const years = (transformed.labels as (string | number)[]) || [];
                const numericYears = years
                    .map(y => (typeof y === 'string' ? parseInt(y, 10) : y))
                    .filter(y => !Number.isNaN(y)) as number[];

                if (numericYears.length > 0) {
                    const yMin = Math.min(...numericYears);
                    const yMax = Math.max(...numericYears);
                    setMinMaxYear({ minYear: yMin, maxYear: yMax });
                    setYearRange([yMin, yMax]);
                } else {
                    setMinMaxYear({ minYear: null, maxYear: null });
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
                            Institution Wide Statistics
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
                        <button
                            type="button"
                            onClick={() => downloadCSV('filtered')}
                            className="flex flex-row gap-1 justify-center items-center text-center bg-sp_dark_green rounded-md p-2 w-[120px] xs:w-[110px] text-headingXs xs:text-bodyXs font-semibold text-white "
                        >
                            <img src="/images/assets/download-icon.svg" alt="Download icon" />
                            Export CSV
                        </button>
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

export default Admin;
