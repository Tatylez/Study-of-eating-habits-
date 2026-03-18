// Данные для опросников (примеры вопросов)
const questionnaires = {
    q1: {
        title: "Опросник пищевых привычек",
        questions: [
            "Я часто ем, даже когда не голоден(а)",
            "Я тщательно контролирую размер порций",
            "Я испытываю чувство вины после еды",
            "Я ем быстрее, чем большинство людей",
            "Я продолжаю есть, даже чувствуя насыщение",
            "Я ем, когда расстроен(а) или взволнован(а)",
            "Я избегаю есть при других людях",
            "Я прячу еду, чтобы съесть потом тайком"
        ],
        scales: {
            "Общий балл": { min: 8, max: 40, norm: 24 },
            "Эмоциональное едение": { min: 3, max: 15, norm: 9 },
            "Экстернальное едение": { min: 3, max: 15, norm: 8 },
            "Ограничительное едение": { min: 2, max: 10, norm: 6 }
        }
    },
    q2: {
        title: "Интероцептивная способность",
        questions: [
            "Я легко чувствую, когда мой желудок пуст",
            "Я понимаю сигналы своего тела о голоде",
            "Мне трудно определить, голоден(а) я или сыт(а)",
            "Я чувствую сердцебиение, когда волнуюсь",
            "Я замечаю напряжение в теле",
            "Я могу определить, что устал(а)",
            "Я чувствую, когда мое тело нуждается в отдыхе",
            "Я игнорирую сигналы тела, когда занят(а)"
        ],
        scales: {
            "Осознанность тела": { min: 3, max: 15, norm: 10 },
            "Чувствительность": { min: 3, max: 15, norm: 9 },
            "Игнорирование сигналов": { min: 2, max: 10, norm: 5 }
        }
    },
    q3: {
        title: "Образ тела",
        questions: [
            "Я доволен(а) своим телом",
            "Я часто сравниваю свое тело с телами других",
            "Я избегаю ситуаций, где мое тело может быть заметно",
            "Я считаю свое тело привлекательным",
            "Меня беспокоит мнение других о моем теле",
            "Я хотел(а) бы изменить свое тело"
        ],
        scales: {
            "Удовлетворенность телом": { min: 2, max: 10, norm: 6 },
            "Социальное сравнение": { min: 2, max: 10, norm: 5 },
            "Избегание": { min: 2, max: 10, norm: 4 }
        }
    },
    q4: {
        title: "Эмоциональное едение",
        questions: [
            "Я ем больше, когда испытываю стресс",
            "Еда успокаивает меня, когда я расстроен(а)",
            "Я использую еду, чтобы справиться с эмоциями",
            "Я ем, когда скучно",
            "Я ем, чтобы наградить себя",
            "Я ем, когда одиноко",
            "Я ищу утешение в еде",
            "Я ем, чтобы заглушить неприятные мысли"
        ],
        scales: {
            "Стрессовое едение": { min: 2, max: 10, norm: 5 },
            "Скука/одиночество": { min: 3, max: 15, norm: 8 },
            "Награда/утешение": { min: 3, max: 15, norm: 7 }
        }
    },
    q5: {
        title: "Пищевые ограничения",
        questions: [
            "Я постоянно сижу на диетах",
            "Я избегаю определенных продуктов",
            "Я считаю калории всего, что ем",
            "Я чувствую вину, если съел(а) 'запрещенную' еду",
            "Я строго контролирую свое питание",
            "У меня есть правила питания",
            "Я взвешиваюсь каждый день",
            "Я планирую свое меню заранее"
        ],
        scales: {
            "Диетическое поведение": { min: 3, max: 15, norm: 8 },
            "Контроль": { min: 3, max: 15, norm: 7 },
            "Чувство вины": { min: 2, max: 10, norm: 5 }
        }
    }
};

// Состояние исследования
let currentScreen = 'welcome-screen';
let answers = {
    demographics: {},
    q1: {}, q2: {}, q3: {}, q4: {}, q5: {}
};

// Подключаем библиотеки для PDF и графиков
function loadScripts() {
    if (!window.jspdf) {
        const pdfScript = document.createElement('script');
        pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(pdfScript);
    }
    
    if (!window.Chart) {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(chartScript);
    }
}

// Переключение экранов
function showScreen(screenId) {
    console.log('Переключаемся на экран:', screenId);
    
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Если показываем экран результатов, отображаем результаты
        if (screenId === 'results-screen') {
            // Даем время на загрузку Chart.js
            setTimeout(() => displayResults(), 500);
        }
    } else {
        console.error('Экран не найден:', screenId);
    }
}

// Функция для отображения вопросов
function renderQuestionnaire(questionnaireId) {
    console.log('Рендерим опросник:', questionnaireId);
    
    const container = document.getElementById(`${questionnaireId}-questions`);
    if (!container) {
        console.error('Контейнер для вопросов не найден:', `${questionnaireId}-questions`);
        return;
    }
    
    const data = questionnaires[questionnaireId];
    
    let html = '';
    data.questions.forEach((question, index) => {
        html += `
            <div class="question-item" data-question="${questionnaireId}_${index}">
                <div class="question-text">${index + 1}. ${question}</div>
                <div class="options">
                    <label>
                        <input type="radio" name="${questionnaireId}_${index}" value="1" required> Никогда
                    </label>
                    <label>
                        <input type="radio" name="${questionnaireId}_${index}" value="2"> Редко
                    </label>
                    <label>
                        <input type="radio" name="${questionnaireId}_${index}" value="3"> Иногда
                    </label>
                    <label>
                        <input type="radio" name="${questionnaireId}_${index}" value="4"> Часто
                    </label>
                    <label>
                        <input type="radio" name="${questionnaireId}_${index}" value="5"> Всегда
                    </label>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Добавляем обработчики для отслеживания ответов
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => checkQuestionnaireCompletion(questionnaireId));
    });
    
    // Сбрасываем прогресс
    const progressId = `progress${questionnaireId.slice(-1)}`;
    const progressBar = document.getElementById(progressId);
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    // Скрываем кнопку перехода
    const nextButtonId = {
        'q1': 'next-to-q2',
        'q2': 'next-to-q3',
        'q3': 'next-to-q4',
        'q4': 'next-to-q5',
        'q5': 'finish-survey'
    }[questionnaireId];
    
    const nextButton = document.getElementById(nextButtonId);
    if (nextButton) {
        nextButton.style.display = 'none';
    }
}

// Проверка завершенности опросника
function checkQuestionnaireCompletion(questionnaireId) {
    const questions = document.querySelectorAll(`#${questionnaireId}-questions .question-item`);
    const totalQuestions = questions.length;
    let answeredQuestions = 0;
    
    questions.forEach(question => {
        const radioName = question.querySelector('input[type="radio"]')?.name;
        if (radioName) {
            const checked = document.querySelector(`input[name="${radioName}"]:checked`);
            if (checked) answeredQuestions++;
        }
    });
    
    // Обновляем прогресс
    const progressId = `progress${questionnaireId.slice(-1)}`;
    const progressBar = document.getElementById(progressId);
    if (progressBar) {
        const progress = (answeredQuestions / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Показываем кнопку следующего опросника, если все отвечено
    if (answeredQuestions === totalQuestions && totalQuestions > 0) {
        const nextButtonId = {
            'q1': 'next-to-q2',
            'q2': 'next-to-q3',
            'q3': 'next-to-q4',
            'q4': 'next-to-q5',
            'q5': 'finish-survey'
        }[questionnaireId];
        
        const nextButton = document.getElementById(nextButtonId);
        if (nextButton) {
            nextButton.style.display = 'block';
        }
    }
}

// Сохранение ответов
function saveAnswers(questionnaireId) {
    const questions = document.querySelectorAll(`#${questionnaireId}-questions .question-item`);
    
    questions.forEach((question, index) => {
        const radioName = `${questionnaireId}_${index}`;
        const checked = document.querySelector(`input[name="${radioName}"]:checked`);
        if (checked) {
            answers[questionnaireId][index] = checked.value;
        }
    });
    
    console.log(`Сохранены ответы для ${questionnaireId}:`, answers[questionnaireId]);
}

// Функция подсчета баллов по шкалам
function calculateScaleScores() {
    const scores = {};
    
    // Для каждого опросника
    for (let q = 1; q <= 5; q++) {
        const questionnaireId = `q${q}`;
        const answers_q = answers[questionnaireId] || {};
        
        // Подсчет сырых баллов
        let totalScore = 0;
        for (let i = 0; i < questionnaires[questionnaireId].questions.length; i++) {
            if (answers_q[i]) {
                totalScore += parseInt(answers_q[i]);
            }
        }
        
        scores[questionnaireId] = {
            total: totalScore,
            scales: {}
        };
        
        // Распределяем вопросы по шкалам (пример - нужно настроить под ваши опросники)
        if (q === 1) {
            scores.q1.scales = {
                "Эмоциональное едение": calculateScale([0,2,5], answers_q),
                "Экстернальное едение": calculateScale([1,3,4], answers_q),
                "Ограничительное едение": calculateScale([6,7], answers_q)
            };
        } else if (q === 2) {
            scores.q2.scales = {
                "Осознанность тела": calculateScale([0,1,4], answers_q),
                "Чувствительность": calculateScale([2,3,5], answers_q),
                "Игнорирование сигналов": calculateScale([6,7], answers_q)
            };
        } else if (q === 3) {
            scores.q3.scales = {
                "Удовлетворенность телом": calculateScale([0,3], answers_q),
                "Социальное сравнение": calculateScale([1,4], answers_q),
                "Избегание": calculateScale([2,5], answers_q)
            };
        } else if (q === 4) {
            scores.q4.scales = {
                "Стрессовое едение": calculateScale([0,1,2], answers_q),
                "Скука/одиночество": calculateScale([3,5,6], answers_q),
                "Награда/утешение": calculateScale([4,7], answers_q)
            };
        } else if (q === 5) {
            scores.q5.scales = {
                "Диетическое поведение": calculateScale([0,1,2], answers_q),
                "Контроль": calculateScale([3,4,5], answers_q),
                "Чувство вины": calculateScale([6,7], answers_q)
            };
        }
    }
    
    return scores;
}

// Вспомогательная функция
