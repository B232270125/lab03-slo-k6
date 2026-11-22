import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20, duration: '30s',
  summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
  // Хоосон threshold нь tag тус бүрийн үр дүнг хураангуйд гаргахад л хэрэгтэй
  thresholds: {
    'http_req_duration{name:cart}': ['max>=0'],
    'http_req_duration{name:report}': ['max>=0'],
    'http_req_failed{name:pay}': ['rate>=0'],
  },
};

export default function () {
  const base = 'http://localhost:3000';
  http.post(`${base}/cart/add`, null, { tags: { name: 'cart' } });
  http.get(`${base}/report`, { tags: { name: 'report' } });
  http.post(`${base}/pay`, null, { tags: { name: 'pay' } });
  sleep(1);
}
