const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

const customFormat = ":method :url :status :response-time ms - :body";

app.use(morgan(customFormat));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: false,
  },
];

const generateId = () => {
  const maxid = notes.length > 0 ? Math.max(...notes.map((p) => p.id)) : 0;
  return maxid + 1;
};

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/info", (req, res) => {
  const hora = new Date();
  res.send(
    `<p>Phonebook has info for ${
      notes.length
    } people<br>${hora.toLocaleString()}</p>`
  );
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (note) {
    res.json(note);
  } else {
    res
      .status(404)
      .send(`<p>No se ha encontrado a la persona con el id ${id}</p>`);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((p) => p.id !== id);

  res.status(204).end();
});

app.post("/api/notes/", (req, res) => {
  const body = req.body;
  const name = notes.find((p) => p.content === body.content);

  if (!body.content) {
    res.status(400).send("<p>Contenido no encontrado</p>");
  } else if (name) {
    res.status(400).send("<p>Nombre ya existente</p>");
  } else {
    const note = {
      id: generateId(),
      content: body.content,
      important: body.important,
    };

    notes = notes.concat(note);
    res.json(note);
  }
});

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const note = notes.find(n => n.id === id);

  if (!note) {
    res.status(404).send('<p>Elemento no encontrado</p>')
  } else {
    const newNote = {
      ...note,
      important : body.important
    }
    notes = notes.map(n => n.id === id ? newNote : n)
    res.json(newNote)
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log("Lanzado en el puerto 3001");
