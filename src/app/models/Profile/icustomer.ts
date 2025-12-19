export interface ICustomer {
    name: string,
    email: string,
    phone: string,
    birthDate: string,
    gender: string,
    height: number,
    weight: number,
    activityLevel: number,
    age: number,
    idealWeight: number,
    bmi: number,
    bmr: number,
    calories: number,
    avoidFoods: string[],
    chronicDiseases: string[],
    medicines: IMedcicine[],
    dailyWeights: WeightTracking[]
}
export interface IMedcicine {
    medicineName: string,
    option: string,
    times: string[]
}

export interface GoalSyustemType {
    name: string
}

export interface WeightTracking {
    date: string;
    weight: number;
}