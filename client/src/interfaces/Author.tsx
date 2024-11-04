export default interface Author {
    firstName: string;
    lastName: string;
    email: string;
    primaryAppointment: string;
    primaryResearchInstitute: string;
    secondaryAppointment: string | null;
    secondaryResearchInstitute: string | null;
    ENID: number;
}
