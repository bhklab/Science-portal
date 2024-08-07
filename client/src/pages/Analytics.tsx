import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import ResizeObserver from 'resize-observer-polyfill';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
import { useMagic } from '../hooks/magicProvider';
import { useNavigate } from 'react-router-dom';
import EmailModal from '../components/EmailModal/EmailModal';

Chart.register(...registerables);

interface Lab {
    name: string;
    firstName: string;
    lastName: string;
}

interface Author {
    firstName: string;
    lastName: string;
    email: string;
    primaryAppointment: string;
    primaryResearchInstitute: string;
    secondaryAppointment: string | null;
    secondaryResearchInstitute: string | null;
    ENID: number;
}

const options = {
    plugins: {
        title: {
            display: true,
            text: 'Number of Links by Year and Type'
        },
        tooltip: {
            mode: 'index' as const,
            intersect: false
        },
        legend: {
            position: 'top' as const
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            stacked: true,
            title: {
                display: true,
                text: 'Years'
            }
        },
        y: {
            stacked: true,
            title: {
                display: true,
                text: '# of Links'
            }
        }
    }
};

const Analytics: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Lab | null>(null);

    const [chartData, setChartData] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [emails, setEmails] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messages = useRef<Messages>(null);
    const { magic } = useMagic();
    const navigate = useNavigate();

    // State of new authors
    const [authors, setAuthors] = useState<Lab[]>([]);

    const [emailToEnid, setEmailToEnid] = useState<{ [email: string]: string }>({});

    const viewAnalyticsRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (selectedAuthor && viewAnalyticsRef.current) {
            viewAnalyticsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedAuthor]);

    useEffect(() => {
        const getEmails = async () => {
            try {
                const res = await axios.get(`/api/emails/all`);
                setEmails(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(`Failed to fetch emails: ${error}`);
            }
        };
        getEmails();
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const getChartData = async () => {
            try {
                const res = await axios.get('/api/stats/supplementary');
                setChartData(res.data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };
        getChartData();
    }, []);

    useEffect(() => {
        if (chartData && chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: chartData,
                options: options
            });
        }
    }, [chartData]);

    useEffect(() => {
        const getAuthors = async () => {
            try {
                const res = await axios.get(`/api/authors/all`);
                const emailToEnid = res.data.reduce((map: { [email: string]: string }, author: Author) => {
                    map[author.email] = author.ENID.toString();
                    return map;
                }, {});
    
                setEmailToEnid(emailToEnid);

                setAuthors(
                    res.data.map((aut: Author) => ({
                        name: `${aut.lastName}, ${aut.firstName}`,
                        firstName: `${aut.firstName}`,
                        lastName: `${aut.lastName}`
                    }))
                );
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getAuthors();
    }, []);

    const handleViewAnalyticsClick = () => {
        setIsModalVisible(true);
    };

    const handleLogin = async () => {
        if (email && magic) {
            if (emails.includes(email)) {
                setIsSubmitting(true);
                await login(email, true);
                setIsSubmitting(false);
            } else {
                messages.current?.show({
                    severity: 'error',
                    summary: 'Oops',
                    detail: 'The email entered does not match the PI email in the database.',
                    sticky: true
                });
            }
        } else {
            console.error('Email is required or Magic is not initialized');
        }
    };

    const login = async (emailAddress: string, showUI: boolean) => {
        try {
            if (magic) {
                if (await magic.user.isLoggedIn()) {
                    await magic.user.logout();
                }
                const did = await magic.auth.loginWithEmailOTP({ email: emailAddress, showUI });
                console.log(`DID Token: ${did}`);

                const enid = emailToEnid[emailAddress];
                const userInfo = await magic.user.getInfo();
                console.log(`UserInfo: ${userInfo}`);
                localStorage.setItem('loginTime', Date.now().toString());
                navigate(`/PiProfile/${enid}`);
                await magic.user.logout();
                setEmail('');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="pt-16">
            <h1 className="text-heading2Xl text-center font-bold py-10">Analytics</h1>
            <div className="flex flex-col px-60 gap-3 md:px-10 sm:px-0">
                <h2 className="text-headingXl font-bold py-10">Supplementary Data</h2>
                {chartData ? (
                    <div className="chart-container relative w-full" style={{ height: '700px' }} ref={containerRef}>
                        <canvas ref={chartRef}></canvas>
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

            <div className="flex flex-col px-60 gap-3 md:px-10 sm:px-0 py-10">
                <div>
                    <h3 className="text-headingXl text-left font-bold">Personal Principal Investigator Data</h3>
                    <p className="text-bodySm text-red-800 w-full text-left">
                        NOTE: You can only view your own analytics. You will recieve a one time code to your institution
                        email to temporarily view your personal science portal statistics
                    </p>
                </div>
                {authors && (
                    <Dropdown
                        value={selectedAuthor}
                        options={authors}
                        optionLabel="name"
                        placeholder="Select a scientist"
                        className="rounded border-1 border-gray-300 w-64 text-black-900"
                        onChange={e => {
                            e.originalEvent?.stopPropagation();
                            setSelectedAuthor(e.value);
                        }}
                        filter
                        showClear
                        filterBy="name"
                    />
                )}
                <div className="flex flex-col gap-2 justify-start items-start">
                    {selectedAuthor && (
                        <button
                            ref={viewAnalyticsRef}
                            className="text-blue-700 text-headingMd pb-20"
                            onClick={handleViewAnalyticsClick}
                        >
                            View my analytics
                        </button>
                    )}
                </div>
            </div>
            <EmailModal 
                isVisible={isModalVisible} 
                onHide={() => setIsModalVisible(false)}
                selectedAuthor={selectedAuthor} 
                setEmail={setEmail} 
                handleLogin={handleLogin} 
                isSubmitting={isSubmitting} 
                email={email} 
            />
        </div>
    );
};

export default Analytics;
