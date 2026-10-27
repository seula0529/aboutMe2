const questions = [
  '내 인생의 드라마나 영화는 무엇인가요? 어떤 점이 마음에 남았나요?',
  '좋아하는 책은 무엇인가요? 그 책을 좋아하는 이유도 들려주세요.',
  '요즘 가장 관심 있는 것은 무엇인가요? 최근의 고민을 나눠주셔도 좋아요.',
  '국내든 해외든, 꼭 가보고 싶은 곳은 어디인가요? 그곳에서 무엇을 하고 싶나요?',
  '즐겨 보는 유튜버나 인스타그래머가 있나요? 어떤 매력 때문에 보게 되나요?',
  '가장 좋아하는 음료와 음식은 무엇인가요? 나만의 추천 조합이 있나요?',
  '나를 한 단어로 표현한다면 무엇인가요? 그 단어를 고른 이유는요?',
  '지금 나 자신을 사랑하는 마음을 1~100점으로 표현한다면 몇 점인가요? 언제 그 마음이 커지나요?',
  '앞으로 꼭 이루고 싶은 삶의 목표는 무엇인가요?',
  '능력을 딱 하나 가질 수 있다면, 어떤 능력을 갖고 싶나요?',
  '심심하거나 혼자 시간이 생기면 주로 무엇을 하나요?',
  '나도 모르게 자주 하는 버릇이나 나만의 독특한 습관이 있나요?',
  '과거의 한 순간을 다시 경험할 수 있다면, 언제로 돌아가고 싶나요?',
  '내가 생각하는 나의 매력은 무엇인가요?',
  '주변 사람들은 나를 어떤 사람이라고 말하나요? 나도 그 말에 공감하나요?',
  '사람들에게 어떤 사람으로 기억되고 싶나요?',
]

const $ = (id) => document.getElementById(id)
let drawn = [] // 뽑은 순서대로

function show(id) {
  for (const p of ['cover', 'draw', 'summary']) $(p).hidden = p !== id
  $('nav').classList.toggle('on-cover', id === 'cover')
  $('endBtn').hidden = id !== 'draw'
  $('drawBtn').hidden = id === 'summary'
  $('restartBtn').hidden = id !== 'summary'
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

$('drawBtn').onclick = () => {
  const left = questions.filter((q) => !drawn.includes(q))
  const q = pick(left)
  drawn.push(q)
  show('draw')
  $('drawBtn').disabled = $('endBtn').disabled = true
  $('num').textContent = '질문을 고르는 중…'
  $('question').classList.remove('reveal')
  $('question').classList.add('shuffling')

  // 3~5초 동안 룰렛처럼 섞음 — 끝으로 갈수록 급격히 느려지고, 막판엔 간격이 들쭉날쭉해 멈출 듯 말 듯
  const total = 3000 + Math.random() * 2000
  const start = performance.now()
  const tick = () => {
    const p = (performance.now() - start) / total
    if (p < 1) {
      $('question').textContent = pick(questions.filter((x) => x !== $('question').textContent))
      let delay = 50 + 750 * p ** 4
      if (p > 0.7) delay *= 0.7 + Math.random() * 0.8
      setTimeout(tick, Math.min(delay, Math.max(0, total - (performance.now() - start))))
      return
    }
    $('num').textContent = `Q${drawn.length}`
    $('question').textContent = q
    $('question').classList.replace('shuffling', 'reveal')
    $('endBtn').disabled = false
    $('drawBtn').disabled = drawn.length === questions.length
    $('drawBtn').textContent = $('drawBtn').disabled ? '모든 질문을 뽑았어요' : '다음 질문 뽑기'
  }
  if (reduceMotion) $('question').textContent = '…'
  setTimeout(tick, reduceMotion ? total : 0)
}

$('endBtn').onclick = () => {
  $('list').replaceChildren(...drawn.map((q) => Object.assign(document.createElement('li'), { textContent: q })))
  show('summary')
}

$('restartBtn').onclick = () => {
  drawn = []
  $('drawBtn').disabled = false
  $('drawBtn').textContent = '질문 뽑기'
  show('cover')
}
