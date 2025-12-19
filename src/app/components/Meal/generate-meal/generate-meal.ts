import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IMeal } from '../../../models/Plan/iplan';
import { Prompt } from '../../../shared/prompt';
import { Alertnotification } from '../../../shared/alerts/alertnotification';
import { FavoriteService } from '../../../shared/Meal/favorite-service';
import { ICustomer } from '../../../models/Profile/icustomer';
import { ProfileService } from '../../../shared/Profile/profile-service';

@Component({
  selector: 'app-generate-meal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './generate-meal.html',
  styleUrls: ['./generate-meal.css'], // صححت styleUrls
})
export class GenerateMeal {
  customer!: ICustomer;
  mealForm: FormGroup;
  isSubmitting: boolean = false;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  resultPrompt: IMeal[] | null = null;
  private notificationService = inject(Alertnotification); // Inject Service

  constructor(private promptService: Prompt,
    private cd: ChangeDetectorRef,
    private mealService: FavoriteService,
    private profileService: ProfileService,
  ) {

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { meal: IMeal } | undefined;

    this.mealForm = this.fb.group({
      mealName: [state?.meal?.name || '', [Validators.required, Validators.minLength(2)]],
      calories: [state?.meal?.calories || '', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      requirements: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.profileService.getCustomer().subscribe(res => {
      this.customer = res;
    });
  }

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
أنت خبير تغذية ورياضي محترف. مهمتك اقتراح 3 وجبات غذائية صحية مفصلة بناءً على البيانات  التالية:
 (${this.mealForm.value})
 بيانات المستخدم
 العمر: ${this.customer.age}
الطول (سم): ${this.customer.height}
الوزن (كجم): ${this.customer.weight}
النشاط اليومي: ${this.customer.activityLevel}
الامراض الخاصة: ${this.customer.chronicDiseases.join(', ')}
الاطعمة التي يجب تجنبها: ${this.customer.avoidFoods.join(', ')}
الادوية المتناولة: ${this.customer.medicines.map(med => med.medicineName).join(', ')}
------------
1. ركز على الصحة أولاً ثم الطعم واجعل الغذاء صحي وغير مكلف ومتوافر في مصر.
2. صوره لكل وجبة:- السعرات الحرارية- البروتين- الكاربوهيدرات- الدهون
اسم الوجبة مثال (طاجن لحم بالبصل والخضروات المشكلة مع أرز)
amount > 0   ,, budget > 0 ex.amount = 1 ,, budget = 50
3. اكتب طريقة التحضير خطوة بخطوة.
4. اكتب كميات ومقادير المكونات."
5. اكتب معلومات الفائدة الصحية لكل وجبة.
6. لا تذكر أنك GPT أو AI، حاول التصرف كخبير تغذية حقيقي .
التزم بالشروط والمتطلبات المذكورة والسعرات المحددة واختر الوجبات الملائمة للشروط والمتطلبات والسعرات 
اقترح وجبات مصرية مع مراعات الحالة الصحية والغذائية والشروط والمتطلبات للمستخدم
status = Pending فى كل الوجبات
7- اختار صور من الروابط التالية فقط لكل وجبة حسب نوعها:
baseURL = https://res.cloudinary.com/dah6fk4zr/image/upload
كمل رابط الصور من القائمة التالية
${this.textImagePrompt}
اضف الراوبط للصور من المثارات المحددة فقط واختر رابط كل صورة ما يتماشى مع نوع الوجبة.
مثال: وجبة فطار صحى رابط الصورة هو : baseURL/Koshari.jpg
8-يرجى تقديم الوجبات الوجبات بتنسيق JSON كما في المثال التالي:
------------

{
[
  "name": "string", "preparation": "string",  "image": "string",  "calories": number,  "protein": number,  "carbs": number,  "fat": number,
  "healthBenefits": "string", "mealType": "string",  "mealTime": "string",  "status": "Pending",  "budget": number,
  "ingredientsDTO": [
    {  "name": "string", "unit": "string", "amount": number  }
  ],
]
}
------------
أرجع النتيجة بصيغة JSON فقط بدون أي كلام إضافي خارج فقط بدون العلامات دى(single or double quotation) او كلمة . . . JSON
`;
  }

  // ================================================================

  onSubmit() {
    if (this.mealForm.valid) {
      this.isSubmitting = true;
      const formData = this.mealForm.value;
      console.log('Form Data:', formData);
      this.resultPrompt = null;
      this.buildPrompt();

      this.savedMeals.clear();
      this.savingMealIndex = null;
      this.cd.detectChanges();


      this.promptService.getMeals(this.textPrompt).subscribe(
        res => {
          if (!res || !res[0] || res.length === 0) {
            this.notificationService.showError(" فشل التوليد، حاول مرة أخرى");
            this.isSubmitting = false;
            this.cd.detectChanges();
            return;
          }

          this.resultPrompt = res;
          this.notificationService.showSuccess('تم توليد الوجبات بنجاح');
          this.isSubmitting = false;
          this.cd.detectChanges();
        },
        err => {
          console.log(err);
          this.notificationService.showError("خطأ في الاتصال — حاول لاحقًا");
          this.isSubmitting = false;
          this.cd.detectChanges();
        }
      );

    } else {
      Object.keys(this.mealForm.controls).forEach(key => {
        this.mealForm.get(key)?.markAsTouched();
      });
    }
  }

  get mealName() { return this.mealForm.get('mealName'); }
  get calories() { return this.mealForm.get('calories'); }
  get requirements() { return this.mealForm.get('requirements'); }

  // =============================

  savingMealIndex: number | null = null;
  savedMeals = new Set<number>();

  saveToFavorites(meal: IMeal, index: number) {
    if (this.savedMeals.has(index)) return;
    this.savingMealIndex = index;

    this.mealService.AddMeal(meal).subscribe({
      next: res => {
        this.savedMeals = new Set([...this.savedMeals, index]);
        this.cd.detectChanges();
        this.notificationService.showSuccess('تم حفظ الوجبة في المفضلة');
        this.savingMealIndex = null;
        this.cd.detectChanges();
      },
      error: err => {
        console.log("ERROR IN ADD FAVORITE = ", err);
        this.cd.detectChanges();
        this.notificationService.showError('فشل الحفظ، حاول مرة أخرى');
        this.savingMealIndex = null;
      }
    });
  }





}
