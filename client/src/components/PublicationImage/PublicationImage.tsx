interface PublicationProps {
    image: string;
}

export const PublicationImage: React.FC<PublicationProps> = ({ image }) => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/images/assets/checker-icon.svg';
    };

    return (
        <img
            src={`/images/publication/${image}`}
            alt="publication"
            className="max-h-full max-w-full"
            onError={handleError}
        />
    );
};
