import React from 'react';
import axios from 'axios';
import AuthorSupplementaryLinks from 'interfaces/AuthorSupplementaryLinks';

interface ProfileResourcesProps {
    enid: number | string;
}

const ProfileResourcesExport: React.FC<ProfileResourcesProps> = ({ enid }) => {
    async function exportResources() {
        try {
            const res = await axios.get<AuthorSupplementaryLinks[]>(`/api/stats/author/links/${enid}`);
            const data = res.data;
            if (!Array.isArray(data) || data.length === 0) return;

            const headers = Object.keys(data[0]);
            const rows = data.map(obj => headers.map(h => `"${(obj as any)[h] ?? ''}"`).join(','));
            const csv = [headers.join(','), ...rows].join('\n');

            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scientist-${enid}-resources.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <button
                className="flex flex-row gap-2 justify-center text-sp_light_green text-sm hover:text-sp_dark_green transition ease-in-out delay-100"
                onClick={() => exportResources()}
            >
                Export My Resources
            </button>
        </div>
    );
};

export default ProfileResourcesExport;
