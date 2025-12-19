export interface IAllCustomer {
    id: number;
    birthDate: string;
    gender: string;
    height: number;
    weight: number;
    activityLevel: number;
    age: number;
    idealWeight: number;
    bmi: number;
    bmr: number;
    calories: number;
}

export interface Medicine {
    medicineName: string;
    option: string;
    time: string;
}

export interface DailyWeight {
    date: string;
    weight: number;
}

export interface GoalPlan {
    name: string;
}

export interface SystemTypePlan {
    name: string;
}
