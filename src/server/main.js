import "https://deno.land/x/dotenv/load.ts";
import { Application, Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';

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
                results: []
            }
        };

        const params = ctx.request.url.searchParams;
        const channel = params.get('channel') || '';
        const user = params.get('user') || '';
        const limit = params.get('limit') || 10;
        const query = params.get('query') || '';

        let roomId = '';

        let roomRes = await getRoomId(channel);

        if (!roomRes.ok) {
            payload.message = 'Channel not found.';
        } else {
            roomId = roomRes.id;
            const messageRes = await getChatMessages(roomId, limit, query);

            if (!messageRes.ok) {
                payload.error = true;
                payload.message = 'Could not retrieve messages. Error occured.';
            } else {
                payload.data.results = messageRes.messages;
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

async function getChatMessages(roomId, limit, query) {
    const endpoint = `${API_URL}/rooms/${roomId}/chatMessages`;
    const payload = { ok: true, messages: [] };

    try {
        const res = await get(endpoint, { limit, q: query });

        // schema: https://developer.gitter.im/docs/messages-resource#parameters
        // sort messages by ISO timestamp
        res.sort((a, b) => b.sent - a.sent);

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

function buildQueryString(params = {}) {
    return Object.entries(params).reduce((str, [key, value]) => {
        if (!value) value = '';
        if (!str) str += '?';
        if (str.length) str += '&';
        str += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        return str;
    }, '');
}