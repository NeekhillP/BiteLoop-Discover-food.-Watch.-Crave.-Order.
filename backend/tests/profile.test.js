import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

test('store profile filters food by partner and requires an existing account', async (t) => {
    process.env.IMAGEKIT_PRIVATE_KEY ||= 'test-key';
    const previousSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'profile-test-secret';
    t.after(() => {
        if (previousSecret === undefined) delete process.env.JWT_SECRET;
        else process.env.JWT_SECRET = previousSecret;
    });
    const { default: foodModel } = await import('../src/models/foodItem.model.js');
    const { default: partnerModel } = await import('../src/models/foodPartner.model.js');
    const { default: userModel } = await import('../src/models/user.model.js');
    const { getFoodPartnerProfile } = await import('../src/controllers/food.controller.js');
    const { authProfileViewerMiddleware } = await import('../src/middlewares/auth.middleware.js');
    const partnerId = '000000000000000000000001';
    const userId = '000000000000000000000002';
    t.mock.method(userModel, 'findById', id => ({ select: async () => id === userId ? { _id: id } : null }));
    t.mock.method(partnerModel, 'findById', id => ({
        select(fields) {
            if (fields === '_id') return Promise.resolve(id === partnerId ? { _id: id } : null);
            assert.equal(fields, 'name address');
            return { lean: async () => id === partnerId ? { _id: id, name: 'Test kitchen', address: 'Test street' } : null };
        },
    }));
    t.mock.method(foodModel, 'find', filter => {
        assert.deepEqual(filter, { foodPartner: partnerId });
        return { select: () => ({ sort: () => ({ lean: async () => [
            { _id: 'food-1', name: 'Test meal', video: 'https://example.com/test.mp4', price: 100, foodPartner: partnerId },
        ] }) }) };
    });
    const app = express();
    app.use(cookieParser());
    app.get('/profile/:partnerId', authProfileViewerMiddleware, getFoodPartnerProfile);
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const base = 'http://127.0.0.1:' + server.address().port + '/profile/';
    const get = (id, accountId) => fetch(base + id, { headers: accountId ? {
        Cookie: 'token=' + jwt.sign({ id: accountId }, process.env.JWT_SECRET),
    } : {} });
    assert.equal((await get(partnerId)).status, 401);
    assert.equal((await get(partnerId, '000000000000000000000003')).status, 401);
    assert.equal((await get('invalid', userId)).status, 400);
    assert.equal((await get('000000000000000000000004', userId)).status, 404);
    for (const accountId of [userId, partnerId]) {
        const response = await get(partnerId, accountId);
        assert.equal(response.status, 200);
        const body = await response.json();
        assert.equal(body.totalMeals, 1);
        assert.equal(body.foodItems[0].foodPartner, partnerId);
        assert.deepEqual(Object.keys(body.foodPartner).sort(), ['_id', 'address', 'name']);
    }
});
