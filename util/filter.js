module.exports = {
  email: mail => /^((\w*)\.?)*@(\w*)((\.(\w+))*)?\.(\w*)$/gm.test(mail),
  word: s => /^\w+$/.test(),
  number: x => {
    try {
      Number(x)
      return true
    } catch (e) {
      return false
    }
  },
  ssn: val => {
    val = val + ''
    val = val
            .replace(/\D/g, '')
            .split('')
            .reverse()
            .slice(0, 10)

    if (val.length !== 10) return false
    let sum = val.map(n => Number(n))
                  .reduce((prev, c, i) => {
                    if (i % 2) c *= 2
                    if (c > 9) c -= 9
                    return prev + c 
                  })
    return 0 === sum % 10
  }
}
