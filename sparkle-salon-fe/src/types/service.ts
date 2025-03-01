/**
 * Frontend Service interface
 */
export interface Service {
    id: number;
    name: string;
    img: string;
    price: number;
    duration: string;
    popularity: number;
    description: string;
    category?: string;
} 