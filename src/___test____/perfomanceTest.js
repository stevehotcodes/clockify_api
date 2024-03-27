import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    vus: 5,
    duration: '60s',
};

export default function () {
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let response = http.get('http://localhost:3000/api/login');

    check(response, {
        'is status 200?': (r) => r.status === 200,
    });

    sleep(1);
}
