module.exports = function (content, res) {
  try 
  {
    content()
  }
  catch (e)
  {
    return res.status(500).json({error:e.message})
  }
}