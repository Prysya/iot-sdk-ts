import { AxiosResponse } from "axios";

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

/**
* Interfaces
*/
export interface INotSerializedData {
  [key:string]: number | string; 
}

export interface IBaseUtilsInterface {
  requestForXml(url: TUrl, data: TData): Promise<TItems>;
  _baseRequest(url: TUrl, data: TData): TAxiosPromiseResponse;
  _parseToXml(xmlText: TXmlText): TXmlParsedData;
  _serialize(data: INotSerializedData): TSerialize;
  _parseErrorMessage(xmlText: TXmlText): string;
  _getItems(xmlParsed: TXmlParsedData): TItems;
  setDebug(): void;
  _checkDebug(): boolean;
}
