export interface IShoppingItem {
    ingredientName: string;
    amount: number;
    unit: string;
    isBought: boolean;
}

export interface IShoppingList {
    planId: number;
    isCompleted: boolean;
    generatedDate: string;
    items: IShoppingItem[];
}
