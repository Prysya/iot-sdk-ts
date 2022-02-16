import axios from 'axios';
import { ErrorsFromServer, Messages } from 'enums';

import { DebugUtils, ParserUtils } from 'utils';

import type { AxiosResponse } from 'axios';
import type { IFilledObject, IParsedJson, TEmptyObject } from 'utils';

/**
 * Types & Interface
 */
export type TUrl = string;
export type TData = string;
export type TAxiosPromiseResponse = Promise<AxiosResponse>;
export type TJsonData = IJsonRequest[] | undefined;

export interface IJsonRequest {
  ascii: string;
  event_ms: number;
  event_time: string;
  value: string;
}

/** Родительский класс с запросами к бекенду SDK*/
export class BaseRequests {
  /**
   * Базовый запрос на сервер
   * @async
   * @param {TUrl} url - url
   * @param {TData} data - body запроса
   * @return {TAxiosPromiseResponse} возвращает промис с результатом
   * */
  private static async _postBaseRequest(url: TUrl, data: TData) {
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
   * Получение AppId из адресной строки
   * @return {String} Строка с айди приложения
   * */
  private static _getAppId(): string {
    const { pathname } = window.location;

    const matcher = pathname.match(/^\/([\s\w\-_]+)\//);

    return matcher && matcher[1] !== undefined ? matcher[1] : 'iot';
  }

  /**
   * Запрос с ответом в виде XML
   * @async
   * @param {TUrl} url - url
   * @param {TData} data - body запроса
   * @return {Promise<IFilledObject>} Массив элементов с атрибутами', либо пустой массив если значение отсутствует
   * */
  public static async postRequestForXml(
    url: TUrl,
    data: TData
  ): Promise<IFilledObject[]> {
    try {
      const response = await BaseRequests._postBaseRequest(url, data);

      const xmlData = response?.data?.trim();

      if (!xmlData) {
        throw new Error(Messages.parseError);
      }

      if (!xmlData.includes('items')) {
        throw new Error(xmlData);
      }

      const items = ParserUtils.parseXmlStringToItemsArray(xmlData);

      if (DebugUtils.checkDebug()) {
        console.group('Debug requestForXml');
        console.log('response: ', response);
        console.log('xmlData: ', xmlData);
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
  public static async postRequestForJSON(
    url: TUrl,
    data: TData
  ): Promise<IParsedJson | TEmptyObject> {
    try {
      const response = await BaseRequests._postBaseRequest(url, data);

      // Если массив пустой и сообщение не "Нет данных" то возвращает ошибку
      if (
        !response.data.hasOwnProperty('array') &&
        response.data.message !== ErrorsFromServer.dataIsUndefined
      ) {
        const errorMessage = response.data.message;

        throw new Error(errorMessage);
      }

      const parsedJson = ParserUtils.parseJsonData(response.data.array);

      if (DebugUtils.checkDebug()) {
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
}
