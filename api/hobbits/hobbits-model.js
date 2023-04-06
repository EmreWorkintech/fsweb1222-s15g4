const db = require('../../data/dbConfig.js')


function getAll() {
  return db('hobbits')
}

function getById(id) {
  return db('hobbits').where('id',id).first();
}

async function insert(hobbit) {
  const [id] = await db('hobbits').insert(hobbit);
  const newHobbit = await getById(id);
  return newHobbit;
}

async function update(id, changes) {
  return null
}

function remove(id) {
  return null
}


module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}