// ===== RESULTS PAGE FUNCTIONALITY =====

let examResult = null;
let examData = null;

document.addEventListener('DOMContentLoaded', function() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) {
        window.location.href = 'login.html';
        return;
    }

    // Get exam result from localStorage
    examResult = JSON.parse(localStorage.getItem('lastExamResult'));
    if (!examResult) {
        alert('Không tìm thấy kết quả bài thi!');
        window.location.href = 'main.html';
        return;
    }

    // Load exam data
    examData = examQuestions[examResult.examId];
    if (!examData) {
        alert('Bài thi không tồn tại!');
        window.location.href = 'main.html';
        return;
    }

    displayResults();
});

function displayResults() {
    if (!examResult || !examData) return;

    // Display exam name
    document.getElementById('examName').textContent = examResult.examTitle;

    // Calculate grade
    const score = parseFloat(examResult.score);
    const percentage = examResult.percentage;
    
    let grade = 'F';
    let gradeClass = 'fail';
    let barClass = 'low';
    
    if (percentage >= 90) {
        grade = 'A+';
        gradeClass = 'excellent';
    } else if (percentage >= 80) {
        grade = 'A';
        gradeClass = 'excellent';
    } else if (percentage >= 70) {
        grade = 'B';
        gradeClass = 'good';
    } else if (percentage >= 60) {
        grade = 'C';
        gradeClass = 'pass';
        barClass = 'medium';
    } else if (percentage >= 50) {
        grade = 'D';
        gradeClass = 'pass';
        barClass = 'medium';
    }

    // Update score circle
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.className = `score-circle ${gradeClass}`;
    scoreCircle.textContent = score;

    // Update result message
    const resultMessage = document.getElementById('resultMessage');
    if (percentage >= 50) {
        resultMessage.textContent = `✅ Chúc mừng! Bạn đã vượt qua bài thi với ${score} điểm`;
    } else {
        resultMessage.textContent = `❌ Rất tiếc! Bạn chưa vượt qua bài thi. Vui lòng làm lại.`;
    }

    // Display stats
    displayStats();

    // Display answer review
    displayAnswerReview();

    // Display recommendation
    displayRecommendation();

    // Update retake button visibility
    if (percentage < 50) {
        document.getElementById('retakeBtn').style.display = 'inline-block';
    }
}

function displayStats() {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';

    const totalQuestions = examResult.totalQuestions;
    const correctAnswers = examResult.correctAnswers;
    const wrongAnswers = totalQuestions - correctAnswers;
    const timeUsed = Math.floor(examResult.timeUsed / 60);
    const percentage = examResult.percentage.toFixed(1);
    const score = examResult.score;

    const stats = [
        { label: 'Tổng Câu Hỏi', value: totalQuestions, unit: 'câu' },
        { label: 'Câu Đúng', value: correctAnswers, unit: 'câu', color: '#6bcf7f' },
        { label: 'Câu Sai', value: wrongAnswers, unit: 'câu', color: '#ff6b6b' },
        { label: 'Tỷ Lệ Đúng', value: percentage, unit: '%' },
        { label: 'Điểm Số', value: score, unit: `/${examData.totalScore}`, color: '#990000' },
        { label: 'Thời Gian Sử Dụng', value: timeUsed, unit: 'phút' }
    ];

    stats.forEach(stat => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <h4>${stat.label}</h4>
            <div class="stat-value" style="${stat.color ? `color: ${stat.color}` : ''}">${stat.value}</div>
            <div class="stat-detail">${stat.unit}</div>
        `;
        statsGrid.appendChild(card);
    });

    // Display mini stats
    const miniStats = document.getElementById('miniStats');
    miniStats.innerHTML = `
        <div class="stat-mini">
            <div class="stat-mini-label">Câu Đúng</div>
            <div class="stat-mini-value" style="color: #6bcf7f;">${correctAnswers}/${totalQuestions}</div>
        </div>
        <div class="stat-mini">
            <div class="stat-mini-label">Tỷ Lệ</div>
            <div class="stat-mini-value">${percentage}%</div>
        </div>
        <div class="stat-mini">
            <div class="stat-mini-label">Điểm</div>
            <div class="stat-mini-value">${score}/${examData.totalScore}</div>
        </div>
        <div class="stat-mini">
            <div class="stat-mini-label">Thời Gian</div>
            <div class="stat-mini-value">${Math.floor(examResult.timeUsed / 60)}'${(examResult.timeUsed % 60).toString().padStart(2, '0')}</div>
        </div>
    `;

    // Update correct percentage bar
    const percentage_num = examResult.percentage;
    const barClass = percentage_num >= 70 ? 'good' : (percentage_num >= 50 ? 'medium' : 'low');
    const bar = document.getElementById('correctPercentageBar');
    bar.className = `progress-fill ${barClass}`;
    bar.textContent = percentage_num.toFixed(1) + '%';
    bar.style.width = percentage_num + '%';
}

function displayAnswerReview() {
    const container = document.getElementById('answerReviewContainer');
    container.innerHTML = '';

    examData.questions.forEach((question, index) => {
        const userAnswer = examResult.userAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;

        const reviewDiv = document.createElement('div');
        reviewDiv.className = `answer-review ${isCorrect ? 'correct' : 'incorrect'}`;

        const userAnswerOption = question.options.find(o => o.id === userAnswer);
        const correctAnswerOption = question.options.find(o => o.id === question.correctAnswer);

        let answerContent = `
            <div class="question-info">
                <div class="question-number">
                    Câu ${index + 1} 
                    <span class="answer-status ${isCorrect ? 'status-correct' : 'status-incorrect'}">
                        ${isCorrect ? '✓ ĐÚNG' : '✗ SAI'}
                    </span>
                </div>
                <div class="question-text">${question.question}</div>
            </div>
        `;

        if (userAnswer) {
            answerContent += `
                <div class="answer-box user-answer">
                    <div class="answer-label">👤 Câu Trả Lời Của Bạn</div>
                    <div class="answer-text">${userAnswerOption.id.toUpperCase()}. ${userAnswerOption.text}</div>
                </div>
            `;
        } else {
            answerContent += `
                <div class="answer-box user-answer">
                    <div class="answer-label">👤 Câu Trả Lời Của Bạn</div>
                    <div class="answer-text" style="color: #ff6b6b;"><em>Không trả lời</em></div>
                </div>
            `;
        }

        if (!isCorrect) {
            answerContent += `
                <div class="answer-box correct-answer">
                    <div class="answer-label">✓ Câu Trả Lời Đúng</div>
                    <div class="answer-text">${correctAnswerOption.id.toUpperCase()}. ${correctAnswerOption.text}</div>
                </div>
            `;
        }

        reviewDiv.innerHTML = answerContent;
        container.appendChild(reviewDiv);
    });
}

function displayRecommendation() {
    const percentage = examResult.percentage;
    let recommendationText = '';

    if (percentage >= 90) {
        recommendationText = `🌟 Xuất Sắc! Bạn có kiến thức rất tốt về môn học này. Hãy tiếp tục duy trì thành tích cao và tìm hiểu sâu hơn những khía cạnh nâng cao của môn học.`;
    } else if (percentage >= 80) {
        recommendationText = `👍 Rất Tốt! Bạn nắm vững kiến thức cơ bản. Để cải thiện điểm số, hãy ôn tập lại những phần chưa chắc chắn và làm thêm bài tập.`;
    } else if (percentage >= 70) {
        recommendationText = `⚡ Tốt! Bạn đã hiểu được phần lớn kiến thức nhưng vẫn còn một số điểm cần cải thiện. Ôn tập lại các khái niệm khó và làm thêm bài tập để nắm vững hơn.`;
    } else if (percentage >= 50) {
        recommendationText = `⚠️ Trung Bình! Bạn vừa vượt qua nhưng cần phải cải thiện rất nhiều. Hãy ôn tập toàn bộ kiến thức, đặc biệt là các phần bạn trả lời sai.`;
    } else {
        recommendationText = `❌ Cần Cải Thiện! Kiến thức của bạn về môn học này còn hạn chế. Hãy quay lại ôn tập từ đầu, chú ý đến các khái niệm cơ bản và làm lại bài thi để kiểm tra lại.`;
    }

    document.getElementById('recommendationText').textContent = recommendationText;
}

function goBackToMain() {
    window.location.href = 'main.html';
}

function printResults() {
    window.print();
}

function retakeExam() {
    if (confirm('Bạn có chắc chắn muốn làm lại bài thi? Kết quả cũ sẽ được giữ lại.')) {
        window.location.href = `exam.html?id=${examResult.examId}`;
    }
}
