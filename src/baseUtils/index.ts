import axios from 'axios';
import { Messages } from '../enums';
import { Errors } from '../enums/errors';
import {
  IBaseUtilsInterface,
  INotSerializedData,
  IParsedJson,
  TAppId,
  TData,
  TEmptyObject,
  TErrorMessage,
  TItems,
  TJsonData,
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
   * @return {Promise<TItems>} Массив значений в ввиде ДОМ ноды, либо пустой массив если значение отсутствует
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
        console.group('Debug requestForXml');
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
   * Запрос с ответом в виде JSON
   * @async
   * @param {TUrl} url - url
   * @param {TData} data - body запроса
   * @return {Promise<IParsedJson>} Обьект значений значений в виде {[номер сигнала]: { event_ms: время сигнала в милисекундах, event_time: время в формате DD-MM-YYYY hh:mm:ss, value: последнее значение }}
   * @example {A2442: { event_ms: 1640324462000, event_time: "24.12.2021 08:41:02" value: "20.3" }}
   * */
  async requestForJSON(url: TUrl, data: TData):  Promise<IParsedJson | TEmptyObject> {
    try {
      const response = await this._baseRequest(url, data);

      // Если массив пустой и сообщение не "Нет данных" то возвращает ошибку
      if (
        !response.data.hasOwnProperty('array') &&
        response.data.message !== Errors.dataIsUndefined
      ) {
        const errorMessage = response.data.message;

        throw new Error(errorMessage);
      }

      const parsedJson = this._parseJsonData(response.data.array);

      if (this._checkDebug()) {
        console.group('Debug requestForJSON');
        console.log('response: ', response);
        console.log('parsedJson: ', parsedJson);
        console.groupEnd();
      }

      return parsedJson;
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
   * @return {TItems} Возвращает массив с элементами
   * */
  _getItems(xmlParsedData: TXmlParsedData): TItems {
    const itemsList = xmlParsedData.querySelectorAll('item');

    return Array.from(itemsList);
  }

  _parseJsonData(jsonData: TJsonData): IParsedJson | TEmptyObject {
    if (Array.isArray(jsonData)) {
      return jsonData.reduce<IParsedJson>(
        (obj, { event_ms, ascii, value, event_time }) => {
          obj[ascii] = { event_ms, value, event_time };

          return obj;
        },
        {}
      );
    }

    return {};
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
