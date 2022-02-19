import { load } from "https://deno.land/x/denv@3.0.0/mod.ts";
import { Application, Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

if (!Deno.env.get('PROD')) {
    await load({ path: '.env' });
}

const API_URL = 'https://api.gitter.im/v1';
const BEARER_TOKEN = Deno.env.get('GITTER_BEARER_TOKEN');
const PORT = Deno.env.get('SERVER_PORT');

const router = new Router();
const app = new Application();

router
    .get('/search', async (ctx) => {
        const payload = {
            error: false,
            message: '',
            data: {
                roomId: '',
                roomName: '',
                results: []
            }
        };

        const params = ctx.request.url.searchParams;

        const roomName = getParam(params.get('roomName'), '');
        const user = getParam(params.get('user'), '');
        const limit = getParam(params.get('limit'), 10);
        const term = getParam(params.get('term'), ''); 
        const skip = getParam(params.get('skip'), '');
        const from = getParam(params.get('from'), '');
        const to = getParam(params.get('to'), '');
        let roomId = getParam(params.get('roomId'), '');

        if (!roomId) {
            const roomRes = await getRoomId(roomName);

            if (!roomRes.ok) {
                payload.error = true;
                payload.message = 'room not found.';
            } else {
                roomId = roomRes.id;
            }
        }

        if (roomId) {
            let query = term;

            if (user) {
                query = `from:@${user.slice(0, 1) == '@' ? user.slice(1) : user} ${term}`;
            }

            if (from || to) {
                query = `sent:[${from || '*'} TO ${to || '*'}] ${query}`;
            }

            const messageRes = await getChatMessages(roomId, limit, query, skip);

            if (!messageRes.ok) {
                payload.error = true;
                payload.message = 'error! could not retrieve messages.';
            } else {
                payload.data = {
                    ...payload.data,
                    roomId,
                    roomName,
                    results: messageRes.messages
                };
            }
        }

        ctx.response.headers.set('Content-Type', 'application/json');
        ctx.response.body = payload;
    })
;

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => console.log(`Server listening on port ${PORT}`));
await app.listen({ port: Number(PORT) });

async function getChatMessages(roomId, limit, query, skip) {
    const endpoint = `${API_URL}/rooms/${roomId}/chatMessages`;
    const payload = { ok: true, messages: [] };

    try {
        const res = await get(endpoint, { limit, skip, q: query });

        // schema: https://developer.gitter.im/docs/messages-resource#parameters
        // sort messages by ISO timestamp, latest first
        res.sort((a, b) => b.sent > a.sent ? 1 : (b.sent < a.sent ? -1 : 0));

        payload.messages = res;
    } catch (e) {
        console.error(e);
        payload.ok = false;
    }

    return payload;
}

async function getRoomId(roomName) {
    const endpoint = `${API_URL}/rooms`;
    const payload = { ok: true, id: '' };

    try {
        const res = await get(endpoint, { q: roomName });

        if (res.results && res.results.length) {
            payload.id = res.results[0].id;
        } else {
            payload.ok = false;
        }
    } catch (e) {
        console.error(e);
        payload.ok = false;
    }

    return payload;
}

function get(url, params = {}) {
    return fetch(url + buildQueryString(params), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${BEARER_TOKEN}`
        }
    }).then(res => res.json());
};

function getParam(value, fallback) {
    if (value == null || value == undefined) {
        return fallback;
    } else if (typeof value == 'string') {
        let v = value.trim();
        if (!v) return fallback;
        return v;
    }

    return value;
}

function buildQueryString(params = {}) {
    return Object.entries(params).reduce((str, [key, value]) => {
        if (!value) value = '';
        if (!str) str += '?';
        if (str.length) str += '&';
        str += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        return str;
    }, '');
}