export type Service = {
    id: number;
    name: string;
    price: number;
    description: string;
    img: string;
};

export type Therapist = {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    experienceYears: number;
    bio: string;
    img: string;
};

export type BookingDate = {
    name: string;
    day: string;
    month: string;
    year: string;
};

export type Payment = {
    paymentId: string;
    description: string;
    paymentName: string;
    url: string;
};

export type TimeSlot = {
    therapistId: string;
    startTime: string;
    endTime: string;
};