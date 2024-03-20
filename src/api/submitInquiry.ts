import { fetchFromAPI, HttpMethod } from './api';

export function submitInquiry(info: {
  email: string;
  name: string;
  subject: string;
  phone_number?: string;
  description: string;
}) {
  return fetchFromAPI<null>({
    method: HttpMethod.post,
    path: 'send-inquiry/',
    jsonBody: info,
  });
}
