import m from 'mithril';

const API_URL = process.env.API_URL;

export function searchRoom(params) {
    return m.request({
        method: 'GET',
        url: `${API_URL}/search`,
        params
    });
}
