/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LiveConnectConfig } from "@google/genai";

const SETTINGS_STORAGE_KEY = 'live-api-settings';

export interface PersistedSettings {
  config: LiveConnectConfig;
  model: string;
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: PersistedSettings): void {
  try {
    const serialized = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): PersistedSettings | null {
  try {
    const serialized = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
    return null;
  }
}

/**
 * Clear settings from localStorage
 */
export function clearSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}