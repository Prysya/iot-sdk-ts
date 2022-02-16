import axios from 'axios';
import { BaseRequests } from './baseRequests';
import { Messages } from '../../enums';

jest.mock('axios');

const URL = 'localhost:3000';
const headers = {
  headers: {
    Accept: 'text/plain, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};

describe('Check base requests', () => {
  describe('Check XML post request', () => {
    it('Should return data from xml', async () => {
      const requestXml = {
        data:
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
          '</items>'
      };

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

      // @ts-ignore
      axios.post.mockResolvedValueOnce(requestXml);

      const request = await BaseRequests.postRequestForXml(URL, '');

      expect(axios.post).toHaveBeenCalledWith(URL, '', headers);
      expect(request).toStrictEqual(equal);
    });

    it('Should throw error with message from server', async () => {
      const errorMessage = 'Ошибка при отправке запроса';

      const requestXml = {
        data: errorMessage
      };

      // @ts-ignore
      axios.post.mockResolvedValueOnce(requestXml);
      await expect(() =>
        BaseRequests.postRequestForXml(URL, '')
      ).rejects.toThrowError(errorMessage);

      expect(axios.post).toHaveBeenCalledWith(URL, '', headers);
    });

    it('Should throw error from constants if data is undefined', async () => {
      await expect(() =>
        BaseRequests.postRequestForXml(URL, '')
      ).rejects.toThrowError(Messages.parseError);

      expect(axios.post).toHaveBeenCalledWith(URL, '', headers);
    });
  });

  describe('Check Json post request', () => {
    it('Should return array with data', () => {

    })
  })
});
