const Hobbit = require('./hobbits-model');
const db = require('../../data/dbConfig');

const newHobbit = {name: "gandalf"}

test('environment ayarı testing olarak ayarlanmış', ()=>{
    expect(process.env.NODE_ENV).toBe("testing");
})

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async ()=> {
    await db.seed.run();
})

describe('----- getAll  --------', ()=> {
    let hobbits;
    beforeEach( async ()=> {
        hobbits = await Hobbit.getAll();
    })
    test('[1] tüm hobbitler doğru sayıda geliyor', async ()=> {
        expect(hobbits).toHaveLength(4);
    })
    test('[2] ilk hobbit doğru olarak geliyor', async ()=> {
        expect(hobbits[0]).toHaveProperty('name', 'sam');
    })
    test('[3] tüm hobbitler doğru olarak geliyor', async ()=> {
        expect(hobbits[0]).toHaveProperty('name', 'sam');
        expect(hobbits[1]).toHaveProperty('name', 'frodo');
        expect(hobbits[2]).toHaveProperty('name', 'pippin');
        expect(hobbits[3]).toHaveProperty('name', 'merry');
    })
})


describe('------ getById -------', ()=> {
    test('[4] doğru formatta geri dönüyor', async ()=> {
        const result = await Hobbit.getById(1);
        expect(result).toBeDefined();
        expect(result).toMatchObject({name:"sam"});
    })
    test('[5] olmayan id için yanlış bilgi dönmüyor', async ()=> {
        const result = await Hobbit.getById(99);
        expect(result).not.toBeDefined();
    })
})


describe('------ insert ------', ()=> {
    test('[6] yeni kişiyi başarılı bir şekilde ekliyor', async ()=> {
        const result = await Hobbit.insert(newHobbit);
        expect(result).toBeDefined();
        expect(result).toMatchObject({name:"gandalf"});
    })
    test('[5] db\'ye doğru şekilde kayıt oldu', async ()=> {
        const result = await Hobbit.insert(newHobbit);
        const hobbits = await db('hobbits');
        expect(hobbits).toHaveLength(5);
        expect(hobbits[4]).toMatchObject(result);
    })
})