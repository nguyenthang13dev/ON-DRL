import { SearchBase } from "../general";

export interface SubjectType {
    id?: string;
    code?: string | null;
    name?: string | null;
    description?: string | null;
    credits?: number | null;
    department?: string | null;
    semester?: number | null;
    prerequisites?: string | null;
    corequisites?: string | null;
    theoryHours?: number | null;
    practiceHours?: number | null;
    isElective?: boolean;
    assessmentMethod?: string | null;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
}

export interface SearchSubjectData extends SearchBase {
    subjectCode?: string;
    name?: string;
    department?: string;
}

export interface TableSubjectDataType {
    id?: string;
    code?: string | null;
    name?: string | null;
    description?: string | null;
    credits?: number | null;
    department?: string | null;
    departmentName?: string | null;
    semester?: number | null;
    prerequisites?: string | null;
    corequisites?: string | null;
    theoryHours?: number | null;
    practiceHours?: number | null;
    isElective?: boolean;
    assessmentMethod?: string | null;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
}

export interface SubjectCreateVM {
    id?: string;
    code: string;
    name: string;
    description?: string | null;
    credits: number;
    department?: string | null;
    semester?: number | null;
    prerequisites?: string | null;
    corequisites?: string | null;
    theoryHours?: number | null;
    practiceHours?: number | null;
    isElective: boolean;
    assessmentMethod?: string | null;
}
