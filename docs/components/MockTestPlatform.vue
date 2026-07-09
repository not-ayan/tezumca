<template>
  <div class="mock-test-container">
    <!-- Welcome Screen -->
    <div v-if="testState === 'welcome'" class="welcome-screen">
      <div class="welcome-card">
        <h2>TUEE Mock Test</h2>
        
        <div class="test-config">
          <div class="config-row">
            <span class="label">Total Questions:</span>
            <span class="value">{{ testConfig.totalQuestions }}</span>
          </div>
          <div class="config-row">
            <span class="label">Marks per Question:</span>
            <span class="value">{{ testConfig.marksPerQuestion }}</span>
          </div>
          <div class="config-row">
            <span class="label">Negative Marking:</span>
            <span class="value">{{ testConfig.negativeMarking }}</span>
          </div>
          <div class="config-row">
            <span class="label">Duration:</span>
            <span class="value">{{ testConfig.totalDuration }} min</span>
          </div>
          <div class="config-row">
            <span class="label">Total Marks:</span>
            <span class="value">{{ testConfig.totalQuestions * testConfig.marksPerQuestion }}</span>
          </div>
        </div>

        <button class="btn-start" @click="startTest">Start Test</button>
      </div>
    </div>

    <!-- Test Screen -->
    <div v-if="testState === 'testing'" class="test-wrapper">
      <!-- Header Bar -->
      <div class="test-header">
        <div class="header-title">TUEE Mock Test</div>
        <div class="header-info">
          Question {{ currentQuestionIndex + 1 }}/{{ testConfig.totalQuestions }}
        </div>
        <div class="timer-box" :class="{ warning: timeLeft < 300, danger: timeLeft < 60 }">
          ⏱ {{ formatTime(timeLeft) }}
        </div>
      </div>

      <div class="test-layout">
        <!-- Left Panel: Questions List -->
        <div class="left-panel">
          <div class="questions-list-header">Questions</div>
          <div class="questions-grid">
            <button
              v-for="(q, index) in testConfig.totalQuestions"
              :key="index"
              @click="goToQuestion(index)"
              class="q-num"
              :class="{
                'active': index === currentQuestionIndex,
                'answered': questions[index].answered,
                'marked': questions[index].marked
              }"
            >
              {{ index + 1 }}
            </button>
          </div>

          <div class="legend">
            <div class="legend-item">
              <span class="legend-dot answered"></span> Answered
            </div>
            <div class="legend-item">
              <span class="legend-dot marked"></span> Marked
            </div>
            <div class="legend-item">
              <span class="legend-dot unanswered"></span> Unanswered
            </div>
          </div>
        </div>

        <!-- Middle Panel: Question -->
        <div class="middle-panel">
          <div class="question-main">
            <div class="q-text">{{ currentQuestion.questionText }}</div>
            <div class="options-list">
              <label v-for="(option, idx) in currentQuestion.options" :key="idx" class="option-item">
                <input
                  type="radio"
                  :name="`q${currentQuestionIndex}`"
                  :value="idx"
                  v-model.number="currentQuestion.selectedAnswer"
                  @change="markAsAnswered"
                />
                <span class="opt-letter">{{ String.fromCharCode(65 + idx) }}</span>
                <span class="opt-text">{{ option }}</span>
              </label>
            </div>
          </div>

          <div class="question-nav">
            <button
              v-if="currentQuestionIndex > 0"
              class="nav-btn"
              @click="previousQuestion"
            >
              ← Previous
            </button>
            <button
              v-if="currentQuestionIndex > 0"
              class="nav-btn"
              @click="markForReview"
              :class="{ 'marked-btn': currentQuestion.marked }"
            >
              {{ currentQuestion.marked ? 'Unmark' : 'Mark' }}
            </button>
            <div class="spacer"></div>
            <button
              v-if="currentQuestionIndex < testConfig.totalQuestions - 1"
              class="nav-btn"
              @click="nextQuestion"
            >
              Next →
            </button>
            <button
              v-else
              class="nav-btn submit-btn"
              @click="submitTest"
            >
              Submit
            </button>
          </div>
        </div>

        <!-- Right Panel: Stats -->
        <div class="right-panel">
          <div class="stats-box">
            <div class="stat">
              <div class="stat-num">{{ stats.attempted }}</div>
              <div class="stat-label">Answered</div>
            </div>
            <div class="stat">
              <div class="stat-num">{{ stats.marked }}</div>
              <div class="stat-label">Marked</div>
            </div>
            <div class="stat">
              <div class="stat-num">{{ stats.unattempted }}</div>
              <div class="stat-label">Unanswered</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Screen -->
    <div v-if="testState === 'result'" class="result-screen">
      <div class="result-box">
        <h2>Test Completed</h2>
        
        <div class="score-display">
          <div class="score-big">{{ testResult.score }}</div>
          <div class="score-total">/ {{ testConfig.totalQuestions * testConfig.marksPerQuestion }}</div>
        </div>

        <div class="percentage-display">{{ testResult.percentage.toFixed(1) }}%</div>

        <div class="result-details">
          <div class="detail">
            <span class="detail-label">Correct:</span>
            <span class="detail-value">{{ testResult.correct }}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Wrong:</span>
            <span class="detail-value">{{ testResult.wrong }}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Skipped:</span>
            <span class="detail-value">{{ testResult.unattempted }}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Accuracy:</span>
            <span class="detail-value">{{ testResult.accuracy.toFixed(1) }}%</span>
          </div>
        </div>

        <button class="btn-again" @click="resetTest">Take Test Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Test Configuration
const testConfig = {
  totalQuestions: 50,
  marksPerQuestion: 2,
  negativeMarking: 0.5,
  totalDuration: 90 // in minutes
}

// State Management
const testState = ref('welcome') // welcome, testing, result
const timeLeft = ref(testConfig.totalDuration * 60) // in seconds
const currentQuestionIndex = ref(0)
const timerInterval = ref(null)

// Questions Array - Template with empty questions
const questions = reactive(
  Array.from({ length: testConfig.totalQuestions }, (_, i) => ({
    id: i + 1,
    questionText: `Question ${i + 1}: [Question text to be added]`,
    options: [
      'Option A',
      'Option B',
      'Option C',
      'Option D'
    ],
    selectedAnswer: null,
    answered: false,
    marked: false
  }))
)

// Test Results
const testResult = reactive({
  score: 0,
  correct: 0,
  wrong: 0,
  unattempted: 0,
  percentage: 0,
  accuracy: 0
})

// Computed Properties
const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const stats = computed(() => {
  let attempted = 0
  let marked = 0
  let unattempted = 0

  questions.forEach(q => {
    if (q.answered) attempted++
    else if (q.marked) marked++
    else unattempted++
  })

  return { attempted, marked, unattempted }
})

// Methods
function startTest() {
  testState.value = 'testing'
  // Request fullscreen when test starts
  const element = document.querySelector('.test-wrapper')
  if (element && element.requestFullscreen) {
    element.requestFullscreen().catch(err => {
      console.log('Fullscreen request failed:', err)
    })
  }
  startTimer()
}

function startTimer() {
  timerInterval.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value)
      submitTest()
    }
  }, 1000)
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function goToQuestion(index) {
  currentQuestionIndex.value = index
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < testConfig.totalQuestions - 1) {
    currentQuestionIndex.value++
  }
}

function markAsAnswered() {
  currentQuestion.value.answered = true
  currentQuestion.value.marked = false
}

function markForReview() {
  if (!currentQuestion.value.answered) {
    currentQuestion.value.marked = !currentQuestion.value.marked
  }
}

function submitTest() {
  clearInterval(timerInterval.value)
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  calculateResults()
  testState.value = 'result'
}

function calculateResults() {
  let correct = 0
  let wrong = 0
  let unattempted = 0

  questions.forEach(q => {
    if (q.answered) {
      correct++
    } else {
      unattempted++
    }
  })

  wrong = 0 // No wrong answers in template

  const score = correct * testConfig.marksPerQuestion - wrong * testConfig.negativeMarking
  const percentage = (score / (testConfig.totalQuestions * testConfig.marksPerQuestion)) * 100
  const accuracy = correct > 0 ? (correct / (correct + wrong)) * 100 : 0

  testResult.correct = correct
  testResult.wrong = wrong
  testResult.unattempted = unattempted
  testResult.score = score.toFixed(2)
  testResult.percentage = percentage
  testResult.accuracy = accuracy
}

function resetTest() {
  testState.value = 'welcome'
  timeLeft.value = testConfig.totalDuration * 60
  currentQuestionIndex.value = 0

  questions.forEach(q => {
    q.selectedAnswer = null
    q.answered = false
    q.marked = false
  })

  Object.assign(testResult, {
    score: 0,
    correct: 0,
    wrong: 0,
    unattempted: 0,
    percentage: 0,
    accuracy: 0
  })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.mock-test-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
}

/* ===== WELCOME SCREEN ===== */
.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--vp-c-bg);
  padding: 20px;
}

.welcome-card {
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  border: 1px solid var(--vp-c-border);
}

.welcome-card h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.test-config {
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid var(--vp-c-border);
}

.config-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.config-row:last-child {
  border-bottom: none;
}

.config-row .label {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.config-row .value {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.btn-start {
  width: 100%;
  padding: 12px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-start:hover {
  background: var(--vp-c-brand-2);
}

/* ===== TEST SCREEN ===== */
.test-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--vp-c-bg);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  z-index: 10000;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--vp-c-bg-alt);
  border-bottom: 2px solid var(--vp-c-border);
  height: 60px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.header-info {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.timer-box {
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
  font-family: 'Courier New', monospace;
  min-width: 100px;
  text-align: center;
}

.timer-box.warning {
  background: #fff3cd;
  color: #856404;
}

.timer-box.danger {
  background: #f8d7da;
  color: #721c24;
}

.test-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
}

/* ===== LEFT PANEL: Questions List ===== */
.left-panel {
  width: 160px;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-border);
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.questions-list-header {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 15px;
  flex: 1;
}

.q-num {
  aspect-ratio: 1;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s;
  color: var(--vp-c-text-2);
}

.q-num:hover {
  border-color: var(--vp-c-brand-1);
}

.q-num.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
  font-weight: 700;
}

.q-num.answered {
  background: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.q-num.marked {
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-border);
  font-size: 11px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-dot.answered {
  background: #28a745;
}

.legend-dot.marked {
  background: #ffc107;
}

.legend-dot.unanswered {
  background: #d0d0d0;
}

/* ===== MIDDLE PANEL: Question ===== */
.middle-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--vp-c-border);
  overflow: hidden;
}

.question-main {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
}

.q-text {
  font-size: 16px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  font-weight: 500;
  margin-bottom: 25px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--vp-c-bg-alt);
}

.option-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.option-item input[type="radio"] {
  margin-top: 3px;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.opt-letter {
  min-width: 20px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  font-size: 14px;
}

.opt-text {
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.5;
}

.question-nav {
  display: flex;
  gap: 10px;
  padding: 15px 25px;
  border-top: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  flex-wrap: wrap;
}

.nav-btn {
  padding: 8px 16px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
  white-space: nowrap;
}

.nav-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.nav-btn.marked-btn {
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.nav-btn.submit-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.nav-btn.submit-btn:hover {
  background: #218838;
  border-color: #218838;
}

.spacer {
  flex: 1;
}

/* ===== RIGHT PANEL: Stats ===== */
.right-panel {
  width: 140px;
  background: var(--vp-c-bg-soft);
  border-left: 1px solid var(--vp-c-border);
  padding: 20px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.stats-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.stat {
  text-align: center;
  padding: 12px;
  background: var(--vp-c-bg-alt);
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
}

/* ===== RESULT SCREEN ===== */
.result-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--vp-c-bg);
  padding: 20px;
}

.result-box {
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 50px 40px;
  max-width: 500px;
  width: 100%;
  border: 1px solid var(--vp-c-border);
  text-align: center;
}

.result-box h2 {
  font-size: 24px;
  color: var(--vp-c-text-1);
  margin-bottom: 30px;
  font-weight: 600;
}

.score-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.score-big {
  font-size: 56px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.score-total {
  font-size: 18px;
  color: var(--vp-c-text-2);
}

.percentage-display {
  font-size: 32px;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 30px;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
}

.detail:nth-child(3),
.detail:nth-child(4) {
  border-bottom: none;
}

.detail-label {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.detail-value {
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.btn-again {
  width: 100%;
  padding: 12px;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-again:hover {
  background: var(--vp-c-brand-2);
}

/* ===== SCROLLBAR ===== */
.left-panel::-webkit-scrollbar,
.question-main::-webkit-scrollbar {
  width: 6px;
}

.left-panel::-webkit-scrollbar-track,
.question-main::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.left-panel::-webkit-scrollbar-thumb,
.question-main::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 3px;
}

.left-panel::-webkit-scrollbar-thumb:hover,
.question-main::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .right-panel {
    width: 120px;
  }

  .left-panel {
    width: 140px;
  }
}

@media (max-width: 768px) {
  .test-layout {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    height: auto;
    max-height: 100px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .right-panel {
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }

  .questions-grid {
    grid-template-columns: repeat(10, 1fr);
  }

  .result-box {
    padding: 30px 20px;
  }

  .score-big {
    font-size: 40px;
  }

  .result-details {
    grid-template-columns: 1fr;
  }
}
</style>
