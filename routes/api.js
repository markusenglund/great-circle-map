const express = require("express")

const router = express.Router()

// Change this to real protected route
router.get("/helloworld", (req, res) => {
  return res.send("Hello world! You made an AJAX-call, congrats!")
})

module.exports = router
