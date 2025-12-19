import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IMeal, IPlan } from '../models/Plan/iplan';

@Injectable({
  providedIn: 'root',
})
export class Prompt {

  private _baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  private apiKey = '';
  keys: string[] = [
    'AIzaSyCJEHRxvgRrqCakJU3SEhCB3T-qQ1gJah8',
    'AIzaSyBk_FbHcY9vztnXHNZc2JA5OfDKIr5Xq3U',
    'AIzaSyDhc7D1BMJHZqnKnUH-pZH_r66yKKk3lgA',
    'AIzaSyCMEi_vXuvUGWRpZ3OpLDrRPWutDKp91Mo',
    'AIzaSyD6JH3f8_evEsD9QbjeYoLenXOfez6ru3M',
    'AIzaSyDV8MFj2y9SlOVCxkiQWKkN34KOF-Mq9I4',
    'AIzaSyAObPRANKhQbtimnWOCjKWpVynKgUWNwss',
    'AIzaSyCc-9iAU15dOnuoHU98gZlX_KP81M_BVtI',
    'AIzaSyCu0_9Z4nalQVicsYhG3I5M3fzEzTL4D_M',
    'AIzaSyAATU4-X9NJMLQqAv80T8GZRoyLmR7mEbI',
    'AIzaSyDMsBvVk6-XKaE-852m8_I4je_vSuvghQE',
    'AIzaSyBuHXGdFXRyJn6mBOWULnTvOJ7M6y0cxRM',
    'AIzaSyAarPEDrEeiSmIRVNEiYlq351_c4UMAbx8',
    'AIzaSyD3XCaqwwb1j7UOOdPt-BsjmRlVc5AyxCM',
    'AIzaSyDzcrVF4x2sceiNsIC4glXWVHBFCB8HPlY',
    'AIzaSyC6lj_eZw2RY7XYn6I_pMVWxNop4MClktE',
  ];

  setApiKey() {
    const index: number = Math.floor(Math.random() * this.keys.length);
    this.apiKey = this.keys[index];
    // alert('API Key Set: ' + this.apiKey);
  }

  constructor(private _http: HttpClient) { }

  getPlan(prompt: string): Observable<IPlan> {
    this.setApiKey();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-goog-api-key': this.apiKey,
    });

    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    return this._http.post<any>(this._baseUrl, body, { headers }).pipe(
      map(res => {
        const rawText = res.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(rawText);
        const cleanedText = rawText.replace(/```json|```/g, "").trim();

        try {
          // console.log(JSON.parse(cleanedText));
          return JSON.parse(cleanedText) as IPlan;
        } catch (e) {
          // console.error('Failed to parse API response', e);
          return {} as IPlan;
        }
      })
    );
  }


  //=============================================================
  //=============================================================

  getMeals(prompt: string): Observable<IMeal[]> {
    this.setApiKey();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-goog-api-key': this.apiKey,
    });

    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    return this._http.post<any>(this._baseUrl, body, { headers }).pipe(
      map(res => {
        const rawText = res.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(rawText);
        const cleanedText = rawText.replace(/```json|```/g, "").trim();

        try {
          return JSON.parse(cleanedText) as IMeal[];
        } catch (e) {
          return {} as IMeal[];
        }
      })
    );
  }
}
