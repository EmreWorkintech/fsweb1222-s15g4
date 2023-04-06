const express = require("express");
const server = express();
const jwt = require('jsonwebtoken');

const Hobbits = require("./hobbits/hobbits-model.js");



server.use(express.json());

server.get("/", (req, res) => {
  const token = jwt.sign({id: 1, name: 'sam'}, "emre deneme yapar", {expiresIn: "8h"} )
  res.status(200).json({ api: "up", token});
});

server.get("/hobbits", (req, res) => {
  Hobbits.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id", async (req, res) => {
  const { id } = req.params;
  const hobbit = await Hobbits.getById(id);
  if(hobbit){
    res.status(200).json(hobbit);
  } else {
    res.status(400).json({message: `${id} idli kullanıcı bulunamadı!..`})
  }
  
});

server.post("/hobbits", async (req, res) => {
  const payload = req.body;
  if(!payload.name || !payload.name.trim()) {
    res.status(400).json({message: 'name bilgisi eksik!..'})
  } else {
    const newHobbit = await Hobbits.insert(payload);
    res.status(201).json(newHobbit);
  }
});

server.delete("/hobbits/:id", (req, res) => {
  const token = req.headers.authorization;
  if(token) {
    jwt.verify(token, "emre deneme yapar", (err, decodedJWT)=> {
      if(!err){
          res.status(200).end()
      } else {
        res.status(404).end()
      }
    }) 
  } else {
    res.status(403).end()
  }
  
  
});

server.put("/hobbits/:id", (req, res) => {
  res.status(404).end()
});

module.exports = server;
