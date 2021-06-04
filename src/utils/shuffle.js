function shuffle (t){
  let last = t.length
  let clone = [...t]
  let n
  while (last > 0) {
    n = rand(last)
    swap(clone, n, --last)
  }
  return clone
}

const rand = n =>
  Math.floor(Math.random() * n)

function swap (t, i, j) {
  let q = t[i]
  t[i] = t[j]
  t[j] = q
  return t
}

export default shuffle
