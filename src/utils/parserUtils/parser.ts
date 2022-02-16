import { xml2js } from 'xml-js';

import { Messages } from 'enums';

import type { IJsonRequest, TJsonData } from 'classes';

/**
 * Inner Constants
 */

const ATTRIBUTES = '_attributes';

/**
 * Types & Interface
 */
export type TErrorMessage = string;
export type THttpParamsString = string;
export type TXmlText = string;
export type TEmptyObject = Record<string, never>;

export interface IFilledObject {
  [key: string]: number | string;
}

export interface IParsedJson {
  [key: string]: Omit<IJsonRequest, 'ascii'>;
}

export class ParserUtils {
  private constructor() {};

  /**
   * Парсинг из XML в виде строки в массив элементов
   * @param {TXmlText} xmlText - XML в виде одной строки
   * @return {array} Возвращает массив элементами или пустой массив
   * */
  public static parseXmlStringToItemsArray(
    xmlText: TXmlText
  ): IFilledObject[] {
    const xmlObject = xml2js(xmlText, {
      ignoreComment: true,
      alwaysChildren: true,
      ignoreDoctype: true,
      ignoreInstruction: true,
      compact: true,
      trim: true,
      nativeType: false,
      attributeValueFn: (val) => decodeURIComponent(val)
    });

    if ('items' in xmlObject && 'item' in xmlObject.items) {
      const item = xmlObject.items.item;

      if (Array.isArray(item)) {
        return xmlObject.items.item.map((itemAttributes: IFilledObject) =>
          ATTRIBUTES in itemAttributes ? itemAttributes[ATTRIBUTES] : {}
        );
      } else {
        if (ATTRIBUTES in xmlObject.items.item) {
          return [xmlObject.items.item[ATTRIBUTES]];
        }
      }
    }

    return [];
  }

  /**
   * Перевод объекта в сериализованную строку для запроса с параметрами
   * @param {TData} data - объект со значениями
   * @return {THttpParamsString} Возвращает строку в виде параметров для запроса
   * */
  public static parseToHttpParamsString(data: IFilledObject): THttpParamsString {
    return Object.keys(data)
      .map(
        (keyName) =>
          `${encodeURIComponent(keyName)}=${encodeURIComponent(data[keyName])}`
      )
      .join('&') || '';
  }

  /**
   * Возвращение текста ошибки
   * @param {TXmlText} xmlText - XML в виде одной строки
   * @return {TErrorMessage} Возвращает строку с сообщением об ошибке
   * */
  public static parseErrorMessage(xmlText: TXmlText): TErrorMessage {
    const regExpForError = new RegExp(`(?<=["\s]>)(.*)(?=\<\/items\>)`, 'sgm');

    const arrayOfMatches = xmlText.match(regExpForError);

    return arrayOfMatches && arrayOfMatches.length > 0
      ? arrayOfMatches[0]
      : Messages.parseError;
  }

  /**
   * Парсинг данных после pull запроса с получением ответа в виде JSON
   * @param {TJsonData} jsonData - JSON данные
   * @return {Object} Возвращает объект с данным по сигналам или пустой объект
   * @example {A2442: { event_ms: 1640324462000, event_time: "24.12.2021 08:41:02" value: "20.3" }}
   * */
  public static parseJsonData(jsonData: TJsonData): IParsedJson | TEmptyObject {
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
}
