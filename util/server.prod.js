module.exports = function (app) {
  // heroku takes care of http(s)
  app.listen(process.env.PORT, u => console.log(`LISTENING ON PORT ${process.env.PORT}`));
}