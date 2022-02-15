import m from 'mithril';

const API_URL = process.env.API_URL;

console.log(`${API_URL}/search`);

export function searchChannel(params) {
    return m.request({
        method: 'GET',
        url: `${API_URL}/search`,
        params
    });
}