<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBuilding, faBolt, faFlask, faArrowRight, faLightbulb, faGamepad, faTrophy, faRefresh, faMagic, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import { useUserStore } from '@/stores/userStore'

library.add(faBuilding, faBolt, faFlask, faArrowRight, faLightbulb, faGamepad, faTrophy, faRefresh, faMagic, faWandMagicSparkles)

const userStore = useUserStore()

const showTriviaGame = ref(false)
const currentQuestion = ref(0)
const score = ref(0)
const gameCompleted = ref(false)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const gameStarted = ref(false)

const showFactCard = ref(false)
const currentFactIndex = ref(0)
const allTriviaQuestions = [
  {
    question: "What is the name of Harry Potter's owl?",
    options: ["Hedwig", "Errol", "Pigwidgeon", "Crookshanks"],
    correct: 0
  },
  {
    question: "Which house does the Sorting Hat almost place Harry Potter in?",
    options: ["Hufflepuff", "Ravenclaw", "Slytherin", "Gryffindor"],
    correct: 2
  },
  {
    question: "What is the name of the three-headed dog guarding the Philosopher's Stone?",
    options: ["Fang", "Fluffy", "Norbert", "Aragog"],
    correct: 1
  },
  {
    question: "Who is the Half-Blood Prince?",
    options: ["Tom Riddle", "Sirius Black", "Severus Snape", "Remus Lupin"],
    correct: 2
  },
  {
    question: "What form does Harry's Patronus take?",
    options: ["Stag", "Doe", "Wolf", "Phoenix"],
    correct: 0
  },
  {
    question: "What is the name of the prison guarded by Dementors?",
    options: ["Nurmengard", "Azkaban", "Durmstrang", "Beauxbatons"],
    correct: 1
  },
  {
    question: "Which Quidditch position does Harry play?",
    options: ["Chaser", "Beater", "Keeper", "Seeker"],
    correct: 3
  },
  {
    question: "What are the three Unforgivable Curses?",
    options: ["Crucio, Imperio, Avada Kedavra", "Expelliarmus, Stupefy, Crucio", "Imperio, Sectumsempra, Crucio", "Avada Kedavra, Expecto Patronum, Imperio"],
    correct: 0
  },
  {
    question: "What is Hermione's cat's name?",
    options: ["Hedwig", "Crookshanks", "Mrs. Norris", "Nagini"],
    correct: 1
  },
  {
    question: "How many Horcruxes did Voldemort create intentionally?",
    options: ["5", "6", "7", "8"],
    correct: 1
  },
  {
    question: "What is the name of the Weasley family home?",
    options: ["The Burrow", "Shell Cottage", "Grimmauld Place", "The Hut"],
    correct: 0
  },
  {
    question: "Which spell is used to disarm an opponent?",
    options: ["Stupefy", "Expelliarmus", "Protego", "Reducto"],
    correct: 1
  },
  {
    question: "What potion does Harry use to get Slughorn's memory?",
    options: ["Veritaserum", "Polyjuice Potion", "Felix Felicis", "Amortentia"],
    correct: 2
  },
  {
    question: "Who teaches Defense Against the Dark Arts in Harry's third year?",
    options: ["Gilderoy Lockhart", "Remus Lupin", "Mad-Eye Moody", "Dolores Umbridge"],
    correct: 1
  },
  {
    question: "What is the name of Hagrid's dragon?",
    options: ["Fluffy", "Buckbeak", "Norbert", "Fang"],
    correct: 2
  },
  {
    question: "Which ingredient is NOT in Polyjuice Potion?",
    options: ["Lacewing flies", "Leeches", "Unicorn hair", "Bicorn horn"],
    correct: 2
  },
  {
    question: "What is the core of Harry's wand?",
    options: ["Dragon heartstring", "Unicorn hair", "Phoenix feather", "Veela hair"],
    correct: 2
  },
  {
    question: "Who killed Dobby?",
    options: ["Voldemort", "Bellatrix Lestrange", "Lucius Malfoy", "Wormtail"],
    correct: 1
  },
  {
    question: "What is the name of the pub in Hogsmeade?",
    options: ["The Leaky Cauldron", "The Three Broomsticks", "The Hog's Head", "Both B and C"],
    correct: 3
  },
  {
    question: "Which Horcrux is destroyed first?",
    options: ["Tom Riddle's Diary", "Marvolo Gaunt's Ring", "Salazar Slytherin's Locket", "Helga Hufflepuff's Cup"],
    correct: 0
  },
  {
    question: "What does the spell 'Obliviate' do?",
    options: ["Kills the target", "Erases memories", "Creates light", "Heals wounds"],
    correct: 1
  },
  {
    question: "Which magical creature can only be seen by those who have witnessed death?",
    options: ["Dementors", "Thestrals", "Boggarts", "Hippogriffs"],
    correct: 1
  },
  {
    question: "What is Hermione's middle name?",
    options: ["Jane", "Jean", "Joy", "June"],
    correct: 1
  },
  {
    question: "Which Quidditch team does Ron support?",
    options: ["Puddlemere United", "Chudley Cannons", "Quidditch United", "Wimbourne Wasps"],
    correct: 1
  },
  {
    question: "What does S.P.E.W. stand for?",
    options: ["Society for the Protection of Elfish Welfare", "Students Preventing Evil Wizardry", "Special Protection of Exotic Wands", "Society for Promoting Equal Wizardry"],
    correct: 0
  },
  {
    question: "Who becomes the new owner of the Elder Wand at the end?",
    options: ["Harry Potter", "Voldemort", "Draco Malfoy", "No one"],
    correct: 0
  },
  {
    question: "What is the name of Neville's plant that he uses in the final battle?",
    options: ["Devil's Snare", "Venomous Tentacula", "Mandrakes", "Gillyweed"],
    correct: 1
  },
  {
    question: "Which Death Eater killed Mad-Eye Moody?",
    options: ["Bellatrix Lestrange", "Voldemort", "Severus Snape", "Dolohov"],
    correct: 1
  },
  {
    question: "What is the password to enter Dumbledore's office in Harry's second year?",
    options: ["Lemon drops", "Sherbet lemon", "Cockroach clusters", "Fizzing whizzbees"],
    correct: 1
  },
  {
    question: "Which form does Severus Snape's Patronus take?",
    options: ["Bat", "Snake", "Doe", "Raven"],
    correct: 2
  },
  {
    question: "What is the first spell Harry successfully performs?",
    options: ["Lumos", "Wingardium Leviosa", "Expecto Patronum", "Expelliarmus"],
    correct: 1
  },
  {
    question: "Who gave Harry the Marauder's Map?",
    options: ["James Potter", "Fred and George Weasley", "Remus Lupin", "Sirius Black"],
    correct: 1
  },
  {
    question: "What does Hermione use to attend multiple classes in her third year?",
    options: ["Floo Powder", "Time-Turner", "Portkey", "Apparition"],
    correct: 1
  },
  {
    question: "Which subject does Professor McGonagall teach?",
    options: ["Transfiguration", "Charms", "Potions", "Herbology"],
    correct: 0
  },
  {
    question: "What is the name of the centaur who teaches Divination after Trelawney is fired?",
    options: ["Bane", "Ronan", "Firenze", "Magorian"],
    correct: 2
  },
  {
    question: "Which ghost is known as the Bloody Baron?",
    options: ["Gryffindor's ghost", "Hufflepuff's ghost", "Ravenclaw's ghost", "Slytherin's ghost"],
    correct: 3
  },
  {
    question: "What creature does Hagrid introduce to his Care of Magical Creatures class first?",
    options: ["Hippogriffs", "Blast-Ended Skrewts", "Unicorns", "Dragons"],
    correct: 0
  },
  {
    question: "What is the name of the street where the Dursleys live?",
    options: ["Magnolia Crescent", "Privet Drive", "Wisteria Walk", "Spinner's End"],
    correct: 1
  },
  {
    question: "Which potion is known as 'Liquid Luck'?",
    options: ["Amortentia", "Veritaserum", "Felix Felicis", "Wolfsbane Potion"],
    correct: 2
  },
  {
    question: "What does the Resurrection Stone do?",
    options: ["Brings people back to life permanently", "Shows echoes of the dead", "Heals fatal injuries", "Grants immortality"],
    correct: 1
  }
]

// Selected questions for current game
const triviaQuestionsRef = ref<Array<{
  question: string
  options: string[]
  correct: number
}>>([])

const triviaQuestions = computed(() => triviaQuestionsRef.value)

const getRandomQuestions = (count: number = 10) => {
  const shuffled = [...allTriviaQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Harry Potter Fun Facts
const harryPotterFacts = [
  "The Hogwarts Express runs on track 9¾ at King's Cross Station.",
  "J.K. Rowling wrote the first Harry Potter book on napkins in a café.",
  "The word 'Dumbledore' is an Old English word for bumblebee.",
  "Harry Potter's birthday is July 31st, the same as J.K. Rowling's.",
  "The Whomping Willow was planted the same year Lupin arrived at Hogwarts.",
  "Chocolate is the best remedy after encountering a Dementor.",
  "The Marauder's Map shows every person in Hogwarts and their exact location.",
  "Hagrid's birthday is December 6th, making him a Sagittarius.",
  "The three-headed dog Fluffy was inspired by Cerberus from Greek mythology.",
  "Quidditch has 700 ways to commit a foul, all of which occurred in the first World Cup.",
  "The Sorting Hat originally belonged to Godric Gryffindor.",
  "Snape's doe Patronus matches Lily Potter's because of his enduring love for her.",
  "The Room of Requirement only appears when someone is in desperate need.",
  "Voldemort's name means 'flight from death' in French.",
  "The Knight Bus can squeeze through impossibly narrow gaps.",
  "Hermione's Time-Turner allows travel back in time, but only for a few hours.",
  "The Forbidden Forest is home to centaurs, unicorns, and acromantulas.",
  "Platform 9¾ was created by a simple charm that allows witches and wizards to pass through.",
  "The Elder Wand is the most powerful wand in existence.",
  "Dobby the house-elf gained his freedom with a sock from Harry Potter."
]

const currentFact = computed(() => harryPotterFacts[currentFactIndex.value])
const bestScore = computed(() => {
  const scores = userStore.quizzScores || {}
  return scores['harry-potter-trivia'] || 0
})

const startTriviaGame = () => {
  // Generate random questions for this game
  triviaQuestionsRef.value = getRandomQuestions(10)

  gameStarted.value = true
  currentQuestion.value = 0
  score.value = 0
  gameCompleted.value = false
  selectedAnswer.value = null
  showResult.value = false
  showTriviaGame.value = true
}

const selectAnswer = (answerIndex: number) => {
  if (showResult.value) return
  selectedAnswer.value = answerIndex
}

const submitAnswer = () => {
  if (selectedAnswer.value === null) return

  showResult.value = true

  if (selectedAnswer.value === triviaQuestions.value[currentQuestion.value].correct) {
    score.value++
  }

  setTimeout(() => {
    if (currentQuestion.value < triviaQuestions.value.length - 1) {
      nextQuestion()
    } else {
      endGame()
    }
  }, 1500)
}

const nextQuestion = () => {
  currentQuestion.value++
  selectedAnswer.value = null
  showResult.value = false
}

const endGame = () => {
  gameCompleted.value = true
  if (!userStore.quizzScores) {
    userStore.quizzScores = {}
  }
  const currentBest = userStore.quizzScores['harry-potter-trivia'] || 0
  if (score.value > currentBest) {
    userStore.quizzScores['harry-potter-trivia'] = score.value
  }
}

const resetGame = () => {
  showTriviaGame.value = false
  gameStarted.value = false
  currentQuestion.value = 0
  score.value = 0
  gameCompleted.value = false
  selectedAnswer.value = null
  showResult.value = false
}

const getRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * harryPotterFacts.length)
  currentFactIndex.value = randomIndex
  showFactCard.value = true
}

const getScoreMessage = () => {
  const percentage = (score.value / triviaQuestions.value.length) * 100
  if (percentage === 100) return "Outstanding! You're a true Harry Potter expert!"
  if (percentage >= 80) return "Excellent! You know your wizarding world well!"
  if (percentage >= 60) return "Good job! You're quite knowledgeable about Harry Potter!"
  if (percentage >= 40) return "Not bad! Maybe it's time for a re-read?"
  return "Better brush up on your Harry Potter knowledge!"
}

const getAnswerClass = (index: number) => {
  if (!showResult.value) {
    return selectedAnswer.value === index ? 'selected-answer' : 'answer-option'
  }
  const isCorrect = index === triviaQuestions.value[currentQuestion.value].correct
  const isSelected = index === selectedAnswer.value
  if (isCorrect) return 'correct-answer'
  if (isSelected && !isCorrect) return 'wrong-answer'
  return 'answer-option disabled'
}

onMounted(() => {
  document.title = 'Harry Potter Trivia & Facts'
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 bg-hogwarts-light">
    </div>
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2 text-shadow">
          <FontAwesomeIcon :icon="faWandMagicSparkles" class="mr-3 text-yellow-400" />
          Harry Potter Trivia & Facts
        </h1>
        <p class="text-xl text-gray-200 text-shadow">Test your knowledge of the wizarding world!</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card class="trivia-card glass-effect">
          <template #title>
            <div class="flex items-center gap-3">
              <FontAwesomeIcon :icon="faGamepad" class="text-3xl text-blue-600" />
              <span>Trivia Challenge</span>
              <Badge v-if="bestScore > 0" :value="`Best: ${bestScore}/10`" severity="success" class="ml-auto" />
            </div>
          </template>
          <template #content>
            <div v-if="!gameStarted" class="text-center py-8">
              <FontAwesomeIcon :icon="faTrophy" class="text-6xl text-yellow-500 mb-4" />
              <h3 class="text-xl font-semibold mb-4">Ready for the Ultimate Harry Potter Quiz?</h3>
              <p class="text-gray-600 mb-6">Test your knowledge with 10 challenging questions about the wizarding world!</p>
              <Button
                label="Start Trivia Game"
                icon="pi pi-play"
                size="large"
                @click="startTriviaGame"
                class="start-game-btn"
              />
            </div>
            <div v-else-if="!gameCompleted" class="trivia-game">
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4">
                  <Badge :value="`Question ${currentQuestion + 1}/10`" severity="info" />
                  <Badge :value="`Score: ${score}`" severity="success" />
                </div>
                <div class="progress-bar mb-4">
                  <div class="progress-fill" :style="{ width: `${((currentQuestion + 1) / triviaQuestionsRef.length) * 100}%` }"></div>
                </div>
              </div>
              <div class="question-section">
                <h3 class="text-lg font-semibold mb-6 text-center">
                  {{ triviaQuestionsRef[currentQuestion].question }}
                </h3>
                <div class="space-y-3 mb-6">
                  <button
                    v-for="(option, index) in triviaQuestionsRef[currentQuestion].options"
                    :key="index"
                    @click="selectAnswer(index)"
                    :class="getAnswerClass(index)"
                    :disabled="showResult"
                  >
                    {{ option }}
                  </button>
                </div>
                <div class="text-center">
                  <Button
                    v-if="!showResult"
                    label="Submit Answer"
                    @click="submitAnswer"
                    :disabled="selectedAnswer === null"
                    severity="info"
                  />
                  <div v-else class="result-feedback">
                    <p v-if="selectedAnswer === triviaQuestionsRef[currentQuestion].correct"
                       class="text-green-600 font-semibold text-lg">
                      ✅ Correct!
                    </p>
                    <p v-else class="text-red-600 font-semibold text-lg">
                      ❌ Wrong! The correct answer is: {{ triviaQuestionsRef[currentQuestion].options[triviaQuestionsRef[currentQuestion].correct] }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="game-complete text-center py-8">
              <FontAwesomeIcon :icon="faTrophy" class="text-6xl text-yellow-500 mb-4" />
              <h3 class="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p class="text-xl mb-4">You scored {{ score }} out of {{ triviaQuestionsRef.length }}!</p>
              <p class="text-gray-600 mb-6">{{ getScoreMessage() }}</p>
              <div class="flex gap-3 justify-center">
                <Button
                  label="Play Again"
                  icon="pi pi-refresh"
                  @click="startTriviaGame"
                  severity="info"
                />
                <Button
                  label="Back to Menu"
                  icon="pi pi-home"
                  @click="resetGame"
                  severity="secondary"
                  outlined
                />
              </div>
            </div>
          </template>
        </Card>
        <Card class="facts-card glass-effect">
          <template #title>
            <div class="flex items-center gap-3">
              <FontAwesomeIcon :icon="faLightbulb" class="text-3xl text-yellow-600" />
              <span>Magical Facts</span>
            </div>
          </template>
          <template #content>
            <div class="text-center py-8">
              <FontAwesomeIcon :icon="faMagic" class="text-6xl text-purple-500 mb-4" />
              <h3 class="text-xl font-semibold mb-4">Discover Amazing Harry Potter Facts!</h3>
              <p class="mb-6">Click the button below to learn fascinating trivia about the wizarding world.</p>
              <Button
                label="Get Random Fact"
                size="large"
                severity="warning"
                @click="getRandomFact"
                class="fact-btn"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
    <Dialog
      v-model:visible="showFactCard"
      modal
      header="🧙‍♂️ Did You Know?"
      :style="{ width: '90vw', maxWidth: '600px' }"
      class="fact-dialog"
    >
      <div class="fact-content text-center py-4">
        <FontAwesomeIcon :icon="faWandMagicSparkles" class="text-4xl text-purple-600 mb-4" />
        <p class="text-lg leading-relaxed">{{ currentFact }}</p>
      </div>
      <template #footer>
        <div class="flex justify-center gap-3">
          <Button
            label="Another Fact!"
            icon="pi pi-refresh"
            @click="getRandomFact"
            severity="info"
          />
          <Button
            label="Close"
            icon="pi pi-times"
            @click="showFactCard = false"
            severity="secondary"
            outlined
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.bg-hogwarts-light {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
}

.bg-hogwarts {
  background-image: url('../assets/images/UkSkylineColour.jpg');
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.trivia-card, .facts-card {
  min-height: fit-content;
  transition: all 0.3s ease;
}

.trivia-card:hover, .facts-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.facts-card.p-card-body{
  height: 100% !important;
}

.start-game-btn, .fact-btn {
  min-width: 200px;
  transition: all 0.3s ease;
}

.start-game-btn:hover, .fact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.answer-option {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.answer-option:hover:not(.disabled) {
  border-color: #3b82f6;
  background: #f0f9ff;
  transform: translateX(4px);
}

.selected-answer {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: #dbeafe;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  cursor: pointer;
}

.correct-answer {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: #dcfce7;
  border: 2px solid #16a34a;
  border-radius: 8px;
  cursor: not-allowed;
}

.wrong-answer {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: #fef2f2;
  border: 2px solid #dc2626;
  border-radius: 8px;
  cursor: not-allowed;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-feedback {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.fact-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: white;
  text-align: center;
}

.fact-dialog :deep(.p-dialog-content) {
  padding: 2rem;
}

.fact-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .trivia-card, .facts-card {
    margin-bottom: 1rem;
  }

  .answer-option, .selected-answer, .correct-answer, .wrong-answer {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}

@keyframes celebration {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.game-complete {
  animation: celebration 0.6s ease-in-out;
}

.dark .selected-answer{
  background: #4c51bf;
  border-color: #5a67d8;
}

.dark .answer-option {
  background: #2d3748;
  border-color: #4a5568;
}

.dark .answer-option:hover {
  background: #767677;
  border-color: #4a5568;
}

.dark .correct-answer {
  background: #48bb78;
  border-color: #38a169;
}

.dark .wrong-answer {
  background: #f56565;
  border-color: #e53e3e;
}

.dark .p-button-outlined.p-button-secondary{
  border-color: #4a5568;
  color: #cbd5e0;
}
</style>