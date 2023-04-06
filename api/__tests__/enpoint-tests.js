const server = require('../server');
const request = require('supertest');
const db = require('../../data/dbConfig');
const jwt = require('jsonwebtoken');


beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

describe('------ [GET] /  -------', ()=> {
    test('[1] up mesajını geri dönüyor', async ()=> {
        const res = await request(server).get('/');
        expect(res.body).toMatchObject({ api: "up" });
        expect(res.status).toBe(200);
    })
})

describe('------ [GET] /hobbits  -------', ()=> {
    test('[2] tüm hobbitleri geri dönüyor', async ()=> {
        const res = await request(server).get('/hobbits');
        expect(res.body).toHaveLength(4);
        expect(res.body[0].name).toBe('sam');
        expect(res.body[0]).toMatchObject({name:'sam'});
        expect(res.body[1].name).toMatch(/fro/);
        expect(res.status).toBe(200);
    })
})

describe('------ [POST] /hobbits  -------', ()=> {
    test('[3] yeni hobbit başarılı bir şekilde kayıt oluyor', async ()=> {
        const yeniHobbit = {name:'gandalf'};
        const res = await request(server).post('/hobbits').send(yeniHobbit);
        expect(res.body.name).toBe('gandalf');
        expect(res.body).toEqual({id: 5, name:'gandalf'});
        expect(res.status).toBe(201);
    })

    test('[4] name eksik ise hata mesjaını doğru dönüyor', async ()=> {
        const yeniHobbit = {firstName:'gandalf'};
        const res = await request(server).post('/hobbits').send(yeniHobbit);
        expect(res.body.message).toBe('name bilgisi eksik!..');
        expect(res.status).toBe(400);
    })
})

describe('------ [GET] /hobbits/:id  -------', ()=> {
    test('[5] geçerli bir id için hobbiti dönüyor', async ()=> {
        const res = await request(server).get('/hobbits/1');
        expect(res.body).toMatchObject({id: 1, name:'sam'});
        expect(res.status).toBe(200);
    })
    test('[6] geçersiz bir id için doğru hata mesajını dönüyor', async ()=> {
        const res = await request(server).get('/hobbits/99');
        expect(res.body.message).toBe('99 idli kullanıcı bulunamadı!..');
        expect(res.status).toBe(400);
    })
})

describe('------ token check -------', ()=> {
    let token;
    beforeAll(async ()=> {
        const res = await request(server).get('/');
        token = res.body.token;
    })
    test('[7] up mesajını geri dönüyor', async ()=> {
        let infoInJWT;
        jwt.verify(token, "emre deneme yapar", (err, decodedJWT)=> {
            if(!err){
                infoInJWT = decodedJWT
            }
        }) 
        expect(infoInJWT).toBeDefined();
        expect(infoInJWT.id).toBe(1);
        expect(infoInJWT.name).toBe('sam');
    })
    test('[8] token ile istek yapabiliyorum', async ()=> {
        const res = await request(server).del('/hobbits/1').set('Authorization', token);
        expect(res.status).toBe(200);
    })
    
})