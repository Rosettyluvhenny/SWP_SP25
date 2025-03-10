export interface Therapist {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  experienceYears: number;
  bio: string;
}

const therapistsData = [
    [
        {
          "id": 1,
          "username": "therapist_john",
          "password": "pass1234",
          "fullName": "John Smith",
          "email": "john.smith@example.com",
          "phone": "3556920235",
          "dob": "1985-07-21",
          "experienceYears": 10,
          "bio": "John is a licensed therapist specializing in cognitive behavioral therapy with over a decade of experience."
        },
        {
          "id": 2,
          "username": "therapy_linda",
          "password": "securePass!",
          "fullName": "Linda Carter",
          "email": "linda.carter@example.com",
          "phone": "3556920236",
          "dob": "1990-05-14",
          "experienceYears": 8,
          "bio": "Linda has extensive experience in family counseling and stress management techniques."
        },
        {
          "id": 3,
          "username": "healing_mark",
          "password": "Healing@789",
          "fullName": "Mark Davis",
          "email": "mark.davis@example.com",
          "phone": "3556920237",
          "dob": "1982-09-30",
          "experienceYears": 15,
          "bio": "Mark specializes in trauma recovery and mindfulness practices to help clients regain peace."
        },
        {
          "id": 4,
          "username": "wellness_amy",
          "password": "AmyWellness#",
          "fullName": "Amy Thompson",
          "email": "amy.thompson@example.com",
          "phone": "3556920238",
          "dob": "1995-11-05",
          "experienceYears": 5,
          "bio": "Amy is passionate about holistic therapy approaches, including meditation and guided relaxation."
        },
        {
          "id": 5,
          "username": "therapy_expert_sam",
          "password": "SamTherapy123",
          "fullName": "Samuel Green",
          "email": "samuel.green@example.com",
          "phone": "3556920239",
          "dob": "1978-02-17",
          "experienceYears": 20,
          "bio": "With two decades of experience, Samuel is an expert in relationship counseling and mental resilience training."
        }
      ]
      
];


export { therapistsData };
