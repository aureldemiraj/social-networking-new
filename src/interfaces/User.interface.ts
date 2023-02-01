export interface CreateUserInterface {
    email: string;
    password: string;
    fullName: string;
    birthDate: string;
    education?: string;
}

export interface UserInterface {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
}
