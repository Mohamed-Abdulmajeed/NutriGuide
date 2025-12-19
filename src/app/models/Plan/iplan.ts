export interface IPlan {
    name: string;
    goal: string;
    systemType: string;
    numberOfDays: number;
    numberOfMeals: number;
    dailyCalories: number;
    meals: IMeal[];
    startDate: string;   // YYYY-MM-DD
    id: number;
}
export interface IMeal {
    name: string;
    preparation: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    healthBenefits: string;
    mealType: string;
    mealTime: string;      // ISO string date
    status: string;
    budget: number;
    ingredientsDTO: Iingredient[];
    planId: number;
    id: number;
}
export interface Iingredient {
    name: string;
    unit: string;
    amount: number;
}
