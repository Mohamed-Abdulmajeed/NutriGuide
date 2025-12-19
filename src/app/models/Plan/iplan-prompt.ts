import { Iingredient } from "./iplan";

export interface IPlanPrompt {
    namePlan: string;
    goal: string;
    systemType: string;
    numberOfDays: number;
    numberOfMeals: number;
    dailyCalories: number;
    mealDays: IMealDay[];  // days
    startDate: string;   // YYYY-MM-DD
}
export interface IMealDay {
    meals: IMealPrompt[];

}
export interface IMealPrompt {
    mealName: string;
    preparation: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    healthBenefits: string;
    mealType: string;
    mealTime: string;
    status: string;
    budget: number;
    ingredientsDTO: Iingredient[];

}
// {
//   "namePlan": "",
//   "goal": "",
//   "systemType": "",
//   "numberOfDays": 0,
//   "numberOfMeals": 0,
//   "dailyCalories": 0,
//   "startDate": "",
//   "mealDays": [
//     {
//       "meals": [
//         {
//           "mealName": "",
//           "preparation": "",
//           "image": "",
//           "calories": 0,
//           "protein": 0,
//           "carbs": 0,
//           "fat": 0,
//           "healthBenefits": "",
//           "mealType": "",
//           "mealTime": "",
//           "status": "",
//           "budget": 0,
//           "ingredientsDTO": [
//             {
//               "name": "",
//               "unit": "",
//               "amount": 0
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }

