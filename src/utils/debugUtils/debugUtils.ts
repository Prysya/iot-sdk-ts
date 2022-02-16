export class DebugUtils {
  private static debugStatus: boolean = false;
  private constructor() {};

  /**
   * Установить флаг для дебага
   * */
  public static setDebug(): void {
    this.debugStatus = true;
  }

  /**
   * Проверка на флаг дебага
   * @return {boolean} Возвращает булево значение
   * */
  public static checkDebug(): boolean {
    return this.debugStatus;
  }
}
