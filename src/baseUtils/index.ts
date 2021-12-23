import axios from 'axios';
import { Messages } from '../enums';
import {
  IBaseUtilsInterface,
  INotSerializedData,
  TAppId,
  TData,
  TErrorMessage,
  TItems,
  TSerialize,
  TUrl,
  TXmlParsedData,
  TXmlText
} from './types';

/** Родительский класс с базовыми методами SDK*/
export class BaseUtils implements IBaseUtilsInterface {
  readonly _appId: TAppId;

  /**
   * Айди приложения по умолчанию Winnum
   * @param {TAppId} appId - айди приложения
   * */
  constructor(appId: TAppId = 'Winnum') {
    this._appId = appId;
  }

  /**
   * Геттер на appId
   * @async
   * @return {string} Вовращает значение appId
   * */
  get appId() {
    return this._appId;
  }

  /**
   * Запрос с ответом в виде XML
   * @async
   * @param {TUrl} url - url
   * @param {TData} data - body запроса
   * @return {Promise<TItems>} Массив значение в ввиде ДОМ ноды, либо пустой массив если значение отсутствует
   * */
  async requestForXml(url: TUrl, data: TData): Promise<TItems> {
    try {
      const response = await this._baseRequest(url, data);

      const xmlData = decodeURIComponent(response.data.trim());

      if (xmlData.includes('Error')) {
        const errorMessage = this._parseErrorMessage(xmlData);

        throw new Error(errorMessage);
      }

      const parsedXml = this._parseToXml(xmlData);

      const items = this._getItems(parsedXml);

      if (this._checkDebug()) {
        console.group('Debug baseRequest');
        console.log('response: ', response);
        console.log('xmlData: ', xmlData);
        console.log('parsedXml: ', parsedXml);
        console.log('items: ', items);
        console.groupEnd();
      }

      return items;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Базовый запрос на сервер
   * @async
   * @param {TUrl} url - url
   * @param {TData} data - body запроса
   * @return {TAxiosPromiseResponse} возвращает промис с результатом
   * */
  async _baseRequest(url: TUrl, data: TData) {
    try {
      return await axios.post(url, data, {
        headers: {
          Accept: 'text/plain, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Парсинг из строки в XML разметку
   * @param {TXmlText} xmlText - XML в виде одной строки
   * @return {TXmlParsedData} Возвращает DOM элемент как XML
   * */
  _parseToXml(xmlText: TXmlText): TXmlParsedData {
    const parser = new DOMParser();

    return parser.parseFromString(xmlText, 'text/xml');
  }

  /**
   * Перевод объекта в сериализованную строку для запроса с параметрами
   * @param {TData} data - объект со значениями
   * @return {TSerialize} Возвращает строку в виде параметров для запроса
   * */
  _serialize(data: INotSerializedData): TSerialize {
    return Object.keys(data)
      .map(
        (keyName) =>
          `${encodeURIComponent(keyName)}=${encodeURIComponent(data[keyName])}`
      )
      .join('&');
  }

  /**
   * Возвращение текста ошибки
   * @param {TXmlText} xmlText - XML в виде одной строки
   * @return {TErrorMessage} Возвращает строку с сообщением об ошибке
   * */
  _parseErrorMessage(xmlText: TXmlText): TErrorMessage {
    const regExpForError = new RegExp(`(?<=">)(.*)(?=\<\/items\>)`, 'sg');

    const arrayOfMatches = xmlText.match(regExpForError);

    return arrayOfMatches && arrayOfMatches.length > 0
      ? arrayOfMatches[0]
      : Messages.parseError;
  }

  /**
   * Получение массива элементов из XML разметки
   * @param {TXmlParsedData} xmlParsedData - DOM XML документ
   * @return {TErrorMessage} Возвращает массив с элементами
   * */
  _getItems(xmlParsedData: TXmlParsedData) {
    const itemsList = xmlParsedData.querySelectorAll('item');

    return Array.from(itemsList);
  }

  /**
   * Установить флаг для дебага
   * @param {TXmlParsedData} xmlParsedData - DOM XML документ
   * */
  setDebug(): void {
    sessionStorage.setItem('debug', 'true');
  }

  /**
   * Проверка на флаг дебага
   * @return {boolean} Возвращает булево значение
   * */
  _checkDebug(): boolean {
    const debug = sessionStorage.getItem('debug');

    return debug !== null;
  }
}
