import { ParserUtils } from './parser';
import { Messages } from '../../enums';

describe('Check parser', () => {
  describe('Check parser parseXmlStringToItemsArray method', () => {
    it('Parser should return array with an one item', () => {
      const xmlText =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<items status="success" lang="ru_ru" >\n' +
        '<item id="winnum.org.attribute.WNAttributeBoolean:862" ' +
        'PersistInfo__createStamp="2021-04-27%2011%3A03%3A46.852" ' +
        'classNameC2="winnum.org.user.WNUser" ' +
        'value1="1" ' +
        'TypeInfo__localizedName="%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82"/>\n' +
        '</items>';

      const equal = [
        {
          id: 'winnum.org.attribute.WNAttributeBoolean:862',
          PersistInfo__createStamp: decodeURIComponent(
            '2021-04-27%2011%3A03%3A46.852'
          ),
          classNameC2: 'winnum.org.user.WNUser',
          value1: '1',
          TypeInfo__localizedName: decodeURIComponent(
            '%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82'
          )
        }
      ];

      expect(ParserUtils.parseXmlStringToItemsArray(xmlText)).toStrictEqual(
        equal
      );
    });

    it('Parser should return array with one item', () => {
      const xmlText =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<items status="success" lang="ru_ru" >\n' +
        '<item id="winnum.org.attribute.WNAttributeBoolean:862" ' +
        'PersistInfo__createStamp="2021-04-28%2011%3A03%3A46.852" ' +
        'classNameC2="winnum.org.user.WNUser" ' +
        'value1="1" ' +
        'TypeInfo__localizedName="%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82"/>\n' +
        '<item id="winnum.org.attribute.WNAttributeBoolean:867" ' +
        'PersistInfo__createStamp="2021-04-29%2011%3A03%3A46.852" ' +
        'classNameC2="winnum.org.user.WNUser" ' +
        'value1="2" ' +
        'TypeInfo__localizedName="%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82"/>\n' +
        '</items>';

      const equal = [
        {
          id: 'winnum.org.attribute.WNAttributeBoolean:862',
          PersistInfo__createStamp: decodeURIComponent(
            '2021-04-28%2011%3A03%3A46.852'
          ),
          classNameC2: 'winnum.org.user.WNUser',
          value1: '1',
          TypeInfo__localizedName: decodeURIComponent(
            '%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82'
          )
        },
        {
          id: 'winnum.org.attribute.WNAttributeBoolean:867',
          PersistInfo__createStamp: decodeURIComponent(
            '2021-04-29%2011%3A03%3A46.852'
          ),
          classNameC2: 'winnum.org.user.WNUser',
          value1: '2',
          TypeInfo__localizedName: decodeURIComponent(
            '%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B0%D1%82%D1%80%D0%B8%D0%B1%D1%83%D1%82'
          )
        }
      ];

      expect(ParserUtils.parseXmlStringToItemsArray(xmlText)).toStrictEqual(
        equal
      );
    });

    it('Parser should return empty array', () => {
      const xmlText = '';

      expect(ParserUtils.parseXmlStringToItemsArray(xmlText)).toStrictEqual([]);
    });
  });

  describe('Check parser parseToSerialize method', () => {
    it('Parser should return string', () => {
      expect(ParserUtils.parseToHttpParamsString({ id: 123, test: 321 })).toBe(
        'id=123&test=321'
      );
    });

    it('Parser should return empty string', () => {
      // @ts-ignore
      expect(ParserUtils.parseToHttpParamsString(123)).toBe('');
    });
  });

  describe('Check parser parseErrorMessage method', () => {
    it('Parser should return message from xml', () => {
      const errorMessage = 'Ошибка внутри айтемов';

      const xmlText =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<items status="error" lang="ru_ru">' +
        errorMessage +
        '</items>';

      expect(ParserUtils.parseErrorMessage(xmlText)).toBe(errorMessage);
    });

    it('Parser should return error from constants', () => {
      expect(ParserUtils.parseErrorMessage('')).toBe(Messages.parseError);
    });
  });

  describe('Check parser parseJsonData method', () => {
    it('Parser should return object type signalId: {...data}', () => {
      const data = [
        {
          event_ms: 123123123123,
          ascii: 'A1312',
          value: '123',
          event_time: '2022-01-01'
        },
        {
          event_ms: 123123123123,
          ascii: 'A1313',
          value: '123',
          event_time: '2022-01-01'
        },
        {
          event_ms: 123123123123,
          ascii: 'A1314',
          value: '123',
          event_time: '2022-01-01'
        }
      ];

      const equal = {
        A1312: {
          event_ms: 123123123123,
          value: '123',
          event_time: '2022-01-01'
        },
        A1313: {
          event_ms: 123123123123,
          value: '123',
          event_time: '2022-01-01'
        },
        A1314: {
          event_ms: 123123123123,
          value: '123',
          event_time: '2022-01-01'
        }
      };

      expect(ParserUtils.parseJsonData(data)).toStrictEqual(equal);
    });

    it('Parser should return empty object', () => {
      expect(ParserUtils.parseJsonData([])).toStrictEqual({})
    })
  });
});
