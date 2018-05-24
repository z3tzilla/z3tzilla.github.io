var quizType = "";
var quizTitles = [];
var quizQuestions = [];
var quizAnswers = [];
var quizComments = [];
var quizCurrentQuestion = 0;
var quizQuestionCount = 0;
var quizContainer = "";
var quizQuestionLocked = false;
var quizCorrectAnswers = 0;

function buildQuiz(quizId, element) {
    resetQuiz();
    $.getJSON('questions.json', result => {
        parseQuiz(result[quizId]);
        quizContainer = `#${quizId}`;
        $(element).append(
            `<div id="${quizId}"></div>`
        );
        startQuiz();
    });
}

function resetQuiz() {
    quizType = "";
    quizTitles = [];
    quizQuestions = [];
    quizAnswers = [];
    quizComments = [];
    quizCurrentQuestion = 0;
    quizContainer = "";
    quizQuestionLocked = false;
    quizCorrectAnswers = 0;
}

function startQuiz() {
    for (let index = 0; index < quizQuestionCount; index++) {
        putQuestionIntoBlock(index, quizContainer);
    }
    showQuestion(0);
}

function parseQuiz(quizJSON) {
    if (typeof quizJSON == undefined) {

    }

    quizType = quizJSON.Type;
    quizQuestionCount = quizJSON.Questions.length;
    var shuffledQuestions = shuffle(quizJSON.Questions);
    shuffledQuestions.forEach(addQuestion);
}

function addQuestion(question) {
    switch (quizType) {
        case "Coverville":
            quizTitles.push(question.SongTitle);
            if (Math.random()>0.5) {
                // Cover
                quizQuestions.push(`<audio controls><source src="${question.CoverFile}" type="audio/mpeg">Не поддерживается проигрывание аудио...</audio>`);
                quizAnswers.push("Cover");
            }
            else {
                // Original
                quizQuestions.push(`<audio controls><source src="${question.OriginalFile}" type="audio/mpeg">Не поддерживается проигрывание аудио...</audio>`);
                quizAnswers.push("Original");
            }
            quizComments.push(question.Comment);
            break;
    
        default:
            break;
    }
}

function putQuestionIntoBlock(index, destination) {
    switch (quizType) {
        case "Coverville":
            $(destination).append(
                `<div class="question">
                    <div class="title">${quizTitles[index]}</div>
                    <div class="text">${quizQuestions[index]}</div>
                    <div class="answers">
                        <div class="answer" id="Original">Оригинал</div>
                        <div class="answer" id="Cover">Кавер</div> 
                    </div>
                </div>
                `
            );
            break;
    
        default:
            break;
    }
}

function hideQuestion(index) {
    $(".question")[index].classList.remove("question-active");
    $("audio")[index].pause();
}
function showQuestion(index) {
    $(".question")[index].classList.add("question-active");
    quizQuestionLocked = false;
}

function nextQuestion() {
    hideQuestion(quizCurrentQuestion++);
    if (quizCurrentQuestion < quizQuestionCount) {
        showQuestion(quizCurrentQuestion);
    }
    else {
        displayResults();
    }
}

function displayResults() {
    $(quizContainer).append(
        `<div class="results"><h1>Вопросы закончились!</h1><br>Правильных ответов: ${quizCorrectAnswers} из ${quizQuestionCount}.</div>`
    );
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

$(document).on('click', '.question .answer', function() {
    if (quizQuestionLocked) return;

    if (this.id == quizAnswers[quizCurrentQuestion]) {
        this.classList.add("answer-correct");
        quizCorrectAnswers++;
    }
    else {
        this.classList.add("answer-incorrect");
    }
    $(".question-active").append(
        `<div class="comment">${quizComments[quizCurrentQuestion]}</div>
         <div class="next">Дальше!</div>`
    )    
    quizQuestionLocked = true;
})

$(document).on('click', '.question .next', function() {
    nextQuestion();
})
