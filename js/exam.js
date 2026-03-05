// ===== EXAM FUNCTIONALITY =====

let currentExamId = null;
let currentQuestionIndex = 0;
let examData = null;
let userAnswers = {};
let timerInterval = null;
let timeRemaining = 0;
let submittedExam = false;

// Initialize exam
document.addEventListener('DOMContentLoaded', function() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
        window.location.href = 'login.html';
        return;
    }

    // Get exam ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    currentExamId = params.get('id') || 1;

    if (!examQuestions[currentExamId]) {
        alert('Bài thi không tồn tại!');
        window.location.href = 'main.html';
        return;
    }

    examData = examQuestions[currentExamId];
    loadExam();
});

function loadExam() {
    if (!examData) return;

    // Set title and description
    document.getElementById('examTitle').textContent = examData.title;
    document.getElementById('examDesc').textContent = examData.description;
    document.getElementById('totalQuestions').textContent = examData.totalQuestions;

    // Initialize user answers
    userAnswers = {};
    examData.questions.forEach(q => {
        userAnswers[q.id] = null;
    });

    // Initialize timer
    timeRemaining = examData.duration * 60; // Convert minutes to seconds
    startTimer();

    // Render questions
    renderQuestions();

    // Render question navigation buttons
    renderQuestionButtons();

    // Display first question
    displayQuestion(0);
}

function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        } else if (timeRemaining <= 300) { // Last 5 minutes
            document.getElementById('timerDisplay').classList.add('warning');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    examData.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.id = `question-${index}`;
        questionDiv.className = 'question-container';
        questionDiv.style.display = index === 0 ? 'block' : 'none';

        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';
        questionHeader.innerHTML = `
            <div class="question-number">Câu ${index + 1}/${examData.totalQuestions}</div>
            <div style="color: #666; font-size: 14px;">
                ${userAnswers[question.id] !== null ? '✓ Đã trả lời' : '○ Chưa trả lời'}
            </div>
        `;

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = question.question;

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        question.options.forEach(option => {
            const optionLabel = document.createElement('label');
            optionLabel.className = 'option-label';
            optionLabel.innerHTML = `
                <input type="radio" name="answer-${question.id}" value="${option.id}"
                    ${userAnswers[question.id] === option.id ? 'checked' : ''}
                    onchange="saveAnswer(${question.id}, '${option.id}')">
                <span class="option-text">${option.id.toUpperCase()}. ${option.text}</span>
            `;
            optionsDiv.appendChild(optionLabel);
        });

        questionDiv.appendChild(questionHeader);
        questionDiv.appendChild(questionText);
        questionDiv.appendChild(optionsDiv);
        container.appendChild(questionDiv);
    });
}

function renderQuestionButtons() {
    const container = document.getElementById('questionButtons');
    container.innerHTML = '';

    examData.questions.forEach((question, index) => {
        const btn = document.createElement('button');
        btn.className = 'q-btn';
        btn.textContent = index + 1;

        if (index === currentQuestionIndex) {
            btn.classList.add('active');
        } else if (userAnswers[question.id] !== null) {
            btn.classList.add('answered');
        } else {
            btn.classList.add('unanswered');
        }

        btn.onclick = () => goToQuestion(index);
        container.appendChild(btn);
    });

    updateStats();
}

function displayQuestion(index) {
    // Hide all questions
    document.querySelectorAll('.question-container').forEach(q => {
        q.style.display = 'none';
    });

    // Show selected question
    const questionDiv = document.getElementById(`question-${index}`);
    if (questionDiv) {
        questionDiv.style.display = 'block';
    }

    currentQuestionIndex = index;

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === examData.questions.length - 1;

    // Update question buttons
    renderQuestionButtons();

    // Scroll to top
    window.scrollTo(0, 0);
}

function saveAnswer(questionId, answer) {
    userAnswers[questionId] = answer;
    renderQuestionButtons();

    // Update the header to show answered status
    const question = examData.questions.find(q => q.id === questionId);
    if (question) {
        const qIndex = examData.questions.indexOf(question);
        const header = document.querySelector(`#question-${qIndex} .question-header`);
        if (header) {
            header.innerHTML = `
                <div class="question-number">Câu ${qIndex + 1}/${examData.totalQuestions}</div>
                <div style="color: #6bcf7f; font-size: 14px;">✓ Đã trả lời</div>
            `;
        }
    }
}

function goToQuestion(index) {
    displayQuestion(index);
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < examData.questions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
    }
}

function updateStats() {
    const totalQuestions = examData.questions.length;
    const answeredCount = Object.values(userAnswers).filter(a => a !== null).length;
    const unansweredCount = totalQuestions - answeredCount;

    document.getElementById('answeredCount').textContent = answeredCount;
    document.getElementById('unansweredCount').textContent = unansweredCount;
}

function openSubmitWarning() {
    const answeredCount = Object.values(userAnswers).filter(a => a !== null).length;
    const totalQuestions = examData.questions.length;
    
    document.getElementById('warningStats').innerHTML = `
        <strong>Câu đã trả lời: ${answeredCount}/${totalQuestions}</strong><br>
        <strong>Câu chưa trả lời: ${totalQuestions - answeredCount}</strong>
    `;
    
    document.getElementById('submitWarning').classList.add('show');
}

function closeSubmitWarning() {
    document.getElementById('submitWarning').classList.remove('show');
}

function handleTimeUp() {
    document.getElementById('timeoutWarning').classList.add('show');
}

function submitExam() {
    submittedExam = true;
    clearInterval(timerInterval);
    
    // Calculate results
    const results = calculateResults();
    
    // Store exam results
    const examResults = {
        examId: currentExamId,
        examTitle: examData.title,
        totalQuestions: examData.questions.length,
        correctAnswers: results.correctCount,
        userAnswers: userAnswers,
        score: results.score,
        percentage: results.percentage,
        timeUsed: examData.duration * 60 - timeRemaining,
        submittedAt: new Date().toISOString()
    };

    // Store in localStorage
    let allResults = JSON.parse(localStorage.getItem('examResults')) || [];
    allResults.push(examResults);
    localStorage.setItem('examResults', JSON.stringify(allResults));
    localStorage.setItem('lastExamResult', JSON.stringify(examResults));

    // Redirect to results page
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 1000);
}

function autoSubmitExam() {
    submittedExam = true;
    
    // Calculate results
    const results = calculateResults();
    
    // Store exam results
    const examResults = {
        examId: currentExamId,
        examTitle: examData.title,
        totalQuestions: examData.questions.length,
        correctAnswers: results.correctCount,
        userAnswers: userAnswers,
        score: results.score,
        percentage: results.percentage,
        timeUsed: examData.duration * 60,
        submittedAt: new Date().toISOString(),
        timedOut: true
    };

    // Store in localStorage
    let allResults = JSON.parse(localStorage.getItem('examResults')) || [];
    allResults.push(examResults);
    localStorage.setItem('examResults', JSON.stringify(allResults));
    localStorage.setItem('lastExamResult', JSON.stringify(examResults));

    // Redirect to results page
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 1000);
}

function calculateResults() {
    let correctCount = 0;
    
    examData.questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        if (userAnswer === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const totalQuestions = examData.questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const score = (percentage / 100) * examData.totalScore;
    
    return {
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        percentage: Math.round(percentage),
        score: Math.round(score * 100) / 100
    };
}

function autoSubmitExam() {
    submittedExam = true;
    
    // Calculate results
    const results = calculateResults();
    
    // Store exam results
    const examResults = {
        examId: currentExamId,
        examTitle: examData.title,
        totalQuestions: examData.questions.length,
        correctAnswers: results.correctCount,
        userAnswers: userAnswers,
        score: results.score,
        percentage: results.percentage,
        timeUsed: examData.duration * 60,
        submittedAt: new Date().toISOString(),
        timedOut: true
    };

    // Store in localStorage
    let allResults = JSON.parse(localStorage.getItem('examResults')) || [];
    allResults.push(examResults);
    localStorage.setItem('examResults', JSON.stringify(allResults));
    localStorage.setItem('lastExamResult', JSON.stringify(examResults));

    // Redirect to results page
    setTimeout(() => {
        window.location.href = 'results.html';
    }, 1000);
}

function calculateResults() {
    let correctCount = 0;
    
    examData.questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        if (userAnswer === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const totalQuestions = examData.questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const score = (percentage / 100) * examData.totalScore;
    
    return {
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        percentage: Math.round(percentage),
        score: Math.round(score * 100) / 100
    };
}
