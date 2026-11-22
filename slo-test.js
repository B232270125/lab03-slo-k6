// k6-ийн сангууд
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // 20 VU тогтмол ачаалал, 1 минут
  vus: 20, duration: '1m',
  thresholds: {
    // Performance SLO: /cart/add latency (README-ийн SLO хүснэгттэй ижил)
    'http_req_duration{name:cart}': ['p(95)<20', 'p(99)<50'],
    // Reliability SLO: /pay error rate
    'http_req_failed{name:pay}': ['rate<0.08'],
    // Availability SLO: бүх хүсэлтийн амжилтын хувь
    'checks': ['rate>0.90'],
    // 4 дэх сценарио: /report latency
    'http_req_duration{name:report}': ['p(95)<450'],
  },
};

export default function () {
  const base = 'http://localhost:3000';
  // Endpoint бүрийг name tag-аар ялгана
  const c = http.post(`${base}/cart/add`, null, { tags: { name: 'cart' } });
  const r = http.get(`${base}/report`, { tags: { name: 'report' } });
  const p = http.post(`${base}/pay`, null, { tags: { name: 'pay' } });
  check(c, { 'cart 200': (x) => x.status === 200 });
  check(r, { 'report 200': (x) => x.status === 200 });
  check(p, { 'pay 200': (x) => x.status === 200 });
  sleep(1);
}
