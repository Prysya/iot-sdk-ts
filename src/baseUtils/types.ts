import { AxiosResponse } from 'axios';

/**
 * Types
 */
export type TAppId = string;
export type TUrl = string;
export type TData = string;
export type TXmlText = string;
export type TXmlParsedData = Document;
export type TItems = Element[] | [];
export type TAxiosPromiseResponse = Promise<AxiosResponse>;
export type TSerialize = string;
export type TErrorMessage = string;
export type TJsonData = IJsonReqest[] | undefined;
export type TEmptyObject = Record<string, never>;

/**
 * Interfaces
 */
export interface IJsonReqest {
  ascii: string;
  event_ms: number;
  event_time: string;
  value: string;
}

export interface IParsedJson {
  [key: string]: Omit<IJsonReqest, 'ascii'>;
}

export interface INotSerializedData {
  [key: string]: number | string;
}

export interface IBaseUtilsInterface {
  requestForXml(url: TUrl, data: TData): Promise<TItems>;
  requestForJSON(url: TUrl, data: TData): Promise<IParsedJson | TEmptyObject>;
  _baseRequest(url: TUrl, data: TData): TAxiosPromiseResponse;
  _parseToXml(xmlText: TXmlText): TXmlParsedData;
  _serialize(data: INotSerializedData): TSerialize;
  _parseErrorMessage(xmlText: TXmlText): string;
  _getItems(xmlParsed: TXmlParsedData): TItems;
  _parseJsonData(jsonData: TJsonData): IParsedJson | TEmptyObject;
  setDebug(): void;
  _checkDebug(): boolean;
}
