import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { PlanService } from '../../../shared/Plan/plan-service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Prompt } from '../../../shared/prompt';
import { GoalSyustemType, ICustomer } from '../../../models/Profile/icustomer';
import { ProfileService } from '../../../shared/Profile/profile-service';
import { CommonModule } from '@angular/common';
import { IMeal, IPlan } from '../../../models/Plan/iplan';
import { Alertnotification } from '../../../shared/alerts/alertnotification';

interface MealsByDay {
  date: string;
  meals: IMeal[];
}

@Component({
  selector: 'app-generate-plan',
  imports: [FormsModule, CommonModule],
  templateUrl: './generate-plan.html',
  styleUrl: './generate-plan.css',
})
export class GeneratePlan {

  customer!: ICustomer;
  loading = false;

  resultPrompt: IPlan | null = null;
  finalPlan: IPlan | null = null;

  mealDaysView: any[] = [];
  selectedMeals: { [day: number]: { [type: string]: { meal: IMeal; mealName: string } } } = {};

  today = new Date().toISOString().split('T')[0];

  planName: string = '';
  date: string = '';
  goal: string = '';
  systemType: string = '';
  numberOfMeal: string = '';
  numberOfDay: number | null = null;
  mealTimes: string = '';


  allGoalPlans: Observable<GoalSyustemType[]>;
  allSystemTypePlans: Observable<GoalSyustemType[]>;
  mealsByDay: MealsByDay[] = [];

  numberOfMeals: string[] = ["2 وجبات", "3 وجبات", "4 وجبات"];
  numberOfDaye: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  private notificationService = inject(Alertnotification); // Inject Service

  // ======== new for view & selection =========

  constructor(private planService: PlanService,
    private promptService: Prompt,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef

  ) {
    this.allGoalPlans = this.planService.getGoalPlan();
    this.allSystemTypePlans = this.planService.getSystemTypePlan();
    this.profileService.getCustomer().subscribe(res => {
      this.customer = res;
    });
  }

  //==============================================
  //==============================================
  textPrompt: string = '';

  textImagePrompt: string = `
  1-/v1765786378/Pizza_vwqjil.jpg
  2-/v1765786377/Koshari_spwtpi.jpg
  3-/v1765786373/Kofta-Fatta_qoat4s.jpg
  4-/v1765786378/meat_stuffed_vegetables_and_rice._b3edfb.webp
  5-/v1765786375/Meat-stew-with-onions_oyk9ga.jpg
  6-/v1765786374/Liver-Sandwiches_nzhqtd.jpg
  7-/v1765786373/Koshari_cdwgec.webp
  8-/v1765786371/Rice_and_vegetables_bdfcpn.png
  9-/v1765873284/BeefShawarmaSandwich_lwvwuh.jpg
  10-/v1765873611/Salep_p9nk0r.jpg
  11-/v1765873700/Sweetened_wheat_nuts_milk_qdrwpc.jpg
  12-/v1765873742/Stuffed_pigeon_with_freekeh_x30hng.jpg
  13-/v1765873780/Stuffed_lamb_intestines_hsnzh5.jpg
  14-/v1765873789/Shakshuka_-_eggs_with_tomatoes_onions_and_spices_dwn4wt.jpg
  15-/v1765873851/Pasta_with_sauce_and_meatballs_pe8rx3.jpg
  16-/v1765873908/Pasta_with_B%C3%A9chamel_sauce_tqjy89.jpg
  17-/v1765873906/Oxtail_stew_k6ltts.jpg
  18-/v1765874025/Grill_tray_-_meat_kofta_-_chicken_kofta_-_chicken_shish_tawook_-_grilled_chicken_-_tahini_-_french_fries_-_yogurt_salad_wro7jt.jpg
  19-/v1765874026/Fava_bean_plate_with_oil_lemon_tomatoes_and_herbs_vnx4ek.jpg
  20-/v1765874024/Eid_Sweets_aw7uwv.jpg
  21-/v1765874022/Falafel_sandwiches_-_bread_-_salad_-_falafel_an1o8i.jpg
  22-/v1765874023/Chocolate_Truffle_wdx7yy.jpg
  23-/v1765874022/Croissant_stuffed_with_romi_cheese_luncheon_meat_eggs_and_arugula_gcqtmm.jpg
  24-/v1765874019/Chicken_breast_nuggets_ysfi8c.jpg
  25-/v1765874575/fava_bean_dish_prnzcm.webp
  `;

  buildPrompt() {
    this.textPrompt = `
أنت خبير تغذية ورياضي محترف. مهمتك إعداد خطة غذائية صحية مفصلة بناءً على بيانات المستخدم التالية:
اسم الخطة: ${this.planName}
تاريخ البداية: ${this.date}
العمر: ${this.customer.age}
الطول (سم): ${this.customer.height}
الوزن (كجم): ${this.customer.weight}
الهدف :${this.goal}
نوع النظام الغذائي: ${this.systemType}
النشاط اليومي: ${this.customer.activityLevel}
الوجبات في اليوم: ${this.numberOfMeal}
مدة الخطة (أيام): ${this.numberOfDay}
مواعيدالوجبات:${this.mealTimes}
الامراض الخاصة: ${this.customer.chronicDiseases.join(', ')}
الاطعمة التي يجب تجنبها: ${this.customer.avoidFoods.join(', ')}
الادوية المتناولة: ${this.customer.medicines.map(med => med.medicineName).join(', ')}
المطلوب: إعداد خطة غذائية صحية ومتوازنة تساعد المستخدم على تحقيق هدفه مع مراعاة حالته الصحية وادويته.
يجب أن تتضمن الخطة:
1-. حساب السعرات اليومية المناسبة لهذا المستخدم بالتفصيل
2. اقترح خطة بالكامل لمدة ${this.numberOfDay} أيام
3. في كل يوم قدم أكثر من اختيار لكل وجبة ( 3 اختيارات لكل وجبة)
اجمالى الوجبات المطلوبة (3 اختيارات لكل وجبة x 
${this.numberOfMeal} وجبات x ${this.numberOfDay}   )
4. استبعد تماماً أي طعام ضمن:الأطعمة الممنوعة 
5. ركز على الصحة أولاً ثم الطعم واجعل الغذاء صحي وغير مكلف ومتوافر في مصر.
6. أظهر محتوى macros لكل وجبةو مسار لينك png صوره لكل وجبة:- السعرات الحرارية- البروتين- الكاربوهيدرات- الدهون
اسم الوجبة مثال (طاجن لحم بالبصل والخضروات المشكلة مع أرز)
amount > 0   ,, budget > 0 ex.amount = 1 ,, budget = 50
7. اكتب طريقة التحضير خطوة بخطوة.
8. اكتب كميات ومقادير المكونات."
9. اكتب معلومات الفائدة الصحية لكل وجبة.
10. لا تذكر أنك GPT أو AI، حاول التصرف كخبير تغذية حقيقي .
اقترح وجبات تناسب هدف المستخدم ونوع النظام الغذائي.
حدد نوع الوجبة (فطار، غداء، عشاء، سناك) ووقت الوجبة (صباحًا، ظهرًا، مساءً) لكل وجبة.
اجعل حالة كل وجبة 
التزم بالشروط والمتطلبات المذكورة أعلاه.
قدم وجبات مصرية واذكر وجبات مختلفة فى كل مرة واختر الصورة المناسبة لكل وجبة 
status = Pending فى كل الوجبات
11- اختار صور من الروابط التالية فقط لكل وجبة حسب نوعها:
baseURL = https://res.cloudinary.com/dah6fk4zr/image/upload
كمل رابط الصور من القائمة التالية
${this.textImagePrompt}
اضف الراوبط للصور من المثارات المحددة فقط واختر رابط كل صورة ما يتماشى مع نوع الوجبة.
مثال: وجبة فطار صحى رابط الصورة هو : baseURL/Koshari.jpg
12-يرجى تقديم الخطة بتنسيق JSON كما في المثال التالي:
------------
{
  "name": "string","goal": "string","systemType": "string","numberOfDays": number,"numberOfMeals": number,"dailyCalories": number,
  "meals": [
    {
      "name": "string","preparation": "string","image": "string(url)","calories": number,"protein": number,"carbs": number,"fat": number,"healthBenefits": "string","mealType": "string","mealTime": "string","status": "Pending","budget": number,
      "ingredientsDTO": [{  "name": "string","unit": "string","amount": number  }],
    }
  ],
  "startDate": "string(date)",
  "id": 0
}
------------
أرجع النتيجة بصيغة JSON فقط بدون أي كلام إضافي خارج فقط بدون العلامات دى(single or double quotation) او كلمة . . . JSON
`;
  }

  // ================================================================
  generatePlan() {
    this.isSaving = false;
    this.isSaved = false;
    this.loading = true;
    this.resultPrompt = null;
    this.finalPlan = null;
    this.selectedMeals = {};
    this.mealDaysView = [];

    this.buildPrompt();
    this.cd.detectChanges();

    this.promptService.getPlan(this.textPrompt).subscribe(
      res => {
        if (!res || !res.meals || res.meals.length === 0) {
          this.notificationService.showError(" فشل التوليد، حاول مرة أخرى");
          this.loading = false;
          return;
        }

        this.resultPrompt = res;
        this.notificationService.showSuccess('تم انشاء الخطة بنجاح');
        this.prepareDays(res);
        this.loading = false;
        this.cd.detectChanges();
      },
      err => {
        console.log(err);
        this.notificationService.showError("خطأ في الاتصال — حاول لاحقًا");
        this.loading = false;
      }
    );
  }

  // ================================================================
  prepareDays(plan: IPlan) {
    this.selectedMeals = {};
    this.cd.detectChanges();
    this.mealDaysView = [];

    const days = plan.numberOfDays;
    const totalMeals = plan.meals.length;
    const mealsPerDay = totalMeals / days;

    for (let d = 0; d < days; d++) {

      const start = d * mealsPerDay;
      const end = start + mealsPerDay;
      const todayMeals = plan.meals.slice(start, end);

      const count = this.resultPrompt?.numberOfMeals ?? 3;

      const itemsPerType = 3;

      const breakfast = todayMeals.slice(0, itemsPerType);

      const lunch =
        count >= 2 ? todayMeals.slice(itemsPerType, itemsPerType * 2) : [];

      const snack =
        count >= 4 ? todayMeals.slice(itemsPerType * 2, itemsPerType * 3) : [];

      const dinner =
        count === 3
          ? todayMeals.slice(itemsPerType * 2, itemsPerType * 3)
          : count === 4
            ? todayMeals.slice(itemsPerType * 3, itemsPerType * 4)
            : [];

      this.mealDaysView.push({
        dayNumber: d + 1,
        date: plan.startDate,
        breakfast,
        lunch,
        snack,
        dinner
      });
    }
  }
  // ================================================================
  selectMeal(day: number, type: string, meal: IMeal) {
    if (!this.selectedMeals[day]) {
      this.selectedMeals[day] = {};
    }

    this.selectedMeals[day][type] = {
      meal,
      mealName: meal.name
    };

    this.cd.detectChanges();
  }

  isSelected(day: number, type: string, meal: IMeal) {

    if (!this.selectedMeals[day] || !this.selectedMeals[day][type])
      return false;

    return this.selectedMeals[day]?.[type]?.mealName === meal.name;
  }
  // ===================================================
  isSaving = false;
  isSaved = false;
  saveError = ''; // لتخزين رسالة الخطأ

  savePlan() {
    if (this.isSaving) return; // منع الضغط أثناء الحفظ

    this.isSaving = true;
    this.isSaved = false;
    this.saveError = '';

    const mealsWithDayInfo: { meal: IMeal; day: number; type: string }[] = [];

    Object.keys(this.selectedMeals)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach(day => {
        Object.keys(this.selectedMeals[day])
          .forEach(type => {
            const entry = this.selectedMeals[day][type];
            if (entry && entry.meal) {
              mealsWithDayInfo.push({ meal: entry.meal, day, type });
            }
          });
      });

    const requiredTotal =
      (this.resultPrompt?.numberOfDays ?? 0) *
      (this.resultPrompt?.numberOfMeals ?? 0);

    if (mealsWithDayInfo.length !== requiredTotal) {
      this.notificationService.showError("يرجى اختيار وجبة لكل نوع في كل يوم قبل الحفظ.");
      this.isSaving = false;
      return;
    }

    const mealOrder: any = { breakfast: 1, lunch: 2, snack: 3, dinner: 4 };

    mealsWithDayInfo.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return (mealOrder[a.type] ?? 99) - (mealOrder[b.type] ?? 99);
    });

    const Meals: IMeal[] = mealsWithDayInfo.map(x => x.meal);

    this.finalPlan = {
      name: this.resultPrompt!.name,
      goal: this.resultPrompt!.goal,
      systemType: this.resultPrompt!.systemType,
      numberOfDays: this.resultPrompt!.numberOfDays,
      numberOfMeals: this.resultPrompt!.numberOfMeals,
      dailyCalories: this.resultPrompt!.dailyCalories,
      meals: Meals,
      startDate: this.resultPrompt!.startDate,
      id: 0
    };

    this.planService.addPlan(this.finalPlan!).subscribe({
      next: res => {
        this.isSaving = false;
        this.isSaved = true; // تم الحفظ 
        this.notificationService.showSuccess('تم حفظ الخطة بنجاح');
      },
      error: err => {
        console.log(err);
        this.isSaving = false;
        this.isSaved = false;
        this.saveError = "خطأ في الحفظ — أعد إنشاء الخطة";
        this.notificationService.showError(this.saveError);
      }
    });
  }

}
// ==============================================
