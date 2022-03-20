const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();

// Get All Movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.status(200).send(movies);
});

// Create Movie
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Genre is not found on the database!");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      // sadece istenen özellikleri diğer döküman içerisine (embedded) olarak yazdık...
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();

  res.status(200).send(movie);
});

// Update Movie
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true } //update edilmiş veriyi geri döndür...
  );

  if (!movie) return res.status(404).send("The movie with the given ID was not found!");
  res.status(200).send(movie);
});

// Delete Movie by ID
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send("The movie with the given ID was not found!");
  res.status(200).send(movie);
});

// Find Movie by ID
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send("The movie with the given ID was not found!");
  res.send(movie);
});

module.exports = router;
