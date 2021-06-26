const express = require("express");
const router = express.Router();
const Todos = require("../Models/todos");

router.get("/get-task", (req, res) => {
  Todos.find({}).then((result) => {
    if (result) {
      return res.status(200).json({ message: "task added", data: result });
    } else {
      return res.status(500).json({ message: "something went wrong." });
    }
  });
});

router.post("/add-task", (req, res) => {
  Todos.create(req.body).then((result) => {
    if (result) {
      return res.status(200).json({ message: "task added" });
    } else {
      return res.status(500).json({ message: "something went wrong." });
    }
  });
});

router.put("/update-task", (req, res) => {
  Todos.findOne({ key: req.body.key })
    .then((result) => {
      console.log(result);
      if (result) {
        const data = result;
        data.value = req.body.value;
        data.isCompleted = req.body.isCompleted;

        console.log(result);
        Todos.findOneAndUpdate(
          { key: req.body.key },
          { $set: data },
          { useFindAndModify: true }
        ).then((updateResult) => {
          if (updateResult.value) {
            return res.status(200).json({ message: "task updated" });
          } else {
            return res.status(500).json({ message: "something went wrong." });
          }
        });
      }
    })
    .catch((err) => res.status(404).json({ message: err.message }));
});

router.delete("/delete-task/:key", (req, res) => {
  console.log(req.params.key);
  Todos.deleteOne({ key: req.params.key })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        return res.status(200).json({ message: "task deleted" });
      } else {
        return res.status(500).json({ message: "something went wrong." });
      }
    })
    .catch((err) => res.status(404).json({ message: err.message }));
});

router.post("/clear-selected-task", async (req, res) => {
  let deletedCount = 0;
  if (req.body) {
    await req.body.map((item) => {
      Todos.deleteOne({ key: item.key })
        .then((result) => {
          console.log(result);
          deletedCount = deletedCount + result.deletedCount;
          if (deletedCount === req.body.length) {
            return res.status(200).json({ message: "task deleted" });
          }
        })
        .catch((err) => res.status(404).json({ message: err.message }));
    });
  }
});

module.exports = router;
