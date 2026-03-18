// Данные для опросников
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

// Нормативные данные для интерпретации
const interpretations = {
    "Опросник 1: Пищевые привычки": {
        veryLow: "Значительно ниже нормы. Возможно, вы недостаточно внимательны к своему питанию.",
        low: "Ниже среднего. Ваши пищевые привычки достаточно гибкие.",
        normal: "В пределах нормы. Сбалансированные пищевые привычки.",
        high: "Выше среднего. Есть некоторые особенности пищевого поведения.",
        veryHigh: "Значительно выше нормы. Может указывать на нарушения пищевого поведения."
    },
    // Добавьте интерпретации для других опросников
};

// Состояние исследования
let currentScreen = 'welcome';
let answers = {
    demographics: {},
    q1: {}, q2: {}, q3: {}, q4: {}, q5: {}
};

// Подключаем библиотеки для PDF
const pdfScript = document.createElement('script');
pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
document.head.appendChild(pdfScript);

// Добавляем библиотеку для графиков
const chartScript = document.createElement('script');
chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(chartScript);

// Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Если показываем экран результатов, отображаем результаты
    if (screenId === 'results-screen') {
        displayResults();
    }
}

// Функция подсчета баллов по шкалам
function calculateScaleScores() {
    const scores = {};
    
    // Для каждого опросника
    for (let q = 1; q <= 5; q++) {
        const questionnaireId = `q${q}`;
        const questionnaire = questionnaires[questionnaireId];
        const answers_q = answers[questionnaireId];
        
        // Подсчет сырых баллов
        let totalScore = 0;
        for (let i = 0; i < questionnaire.questions.length; i++) {
            if (answers_q[i]) {
                totalScore += parseInt(answers_q[i]);
            }
        }
        
        // Расчет по шкалам (пример - нужно настроить под ваши опросники)
        scores[questionnaireId] = {
            total: totalScore,
            scales: {}
        };
        
        // Распределяем вопросы по шкалам (пример)
        if (q === 1) {
            scores[q1].scales = {
                "Эмоциональное едение": calculateScale([0,2,5], answers_q),
                "Экстернальное едение": calculateScale([1,3,4], answers_q),
                "Ограничительное едение": calculateScale([6,7], answers_q)
            };
        }
        // Добавьте аналогично для других опросников
    }
    
    return scores;
}

// Вспомогательная функция для подсчета по шкале
function calculateScale(indices, answers) {
    let sum = 0;
    indices.forEach(i => {
        if (answers[i]) sum += parseInt(answers[i]);
    });
    return sum;
}

// Функция отображения результатов
function displayResults() {
    const scores = calculateScaleScores();
    
    // Создаем профильный график
    createProfileChart(scores);
    
    // Отображаем каждую шкалу
    for (let q = 1; q <= 5; q++) {
        displayScaleResults(q, scores[`q${q}`]);
    }
}

// Создание профильного графика
function createProfileChart(scores) {
    const ctx = document.createElement('canvas');
    ctx.id = 'profileChart';
    document.getElementById('profileChart').innerHTML = '';
    document.getElementById('profileChart').appendChild(ctx);
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
            datasets: [{
                label: 'Ваши результаты',
                data: [
                    scores.q1.total,
                    scores.q2.total,
                    scores.q3.total,
                    scores.q4.total,
                    scores.q5.total
                ],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }, {
                label: 'Норма',
                data: [24, 24, 20, 22, 20], // Нормативные значения
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderColor: 'rgba(46, 204, 113, 0.5)',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 50
                }
            }
        }
    });
}

// Отображение результатов по одной шкале
function displayScaleResults(questionnaireNumber, scores) {
    const scaleCard = document.getElementById(`scale${questionnaireNumber}`);
    const barsContainer = scaleCard.querySelector('.scale-bars');
    const interpretationEl = scaleCard.querySelector('.scale-interpretation');
    
    let barsHtml = '';
    let interpretationText = '';
    
    for (let [scaleName, value] of Object.entries(scores.scales)) {
        const norm = questionnaires[`q${questionnaireNumber}`].scales[scaleName]?.norm || 5;
        const max = questionnaires[`q${questionnaireNumber}`].scales[scaleName]?.max || 10;
        const percentage = (value / max) * 100;
        
        barsHtml += `
            <div class="bar-item">
                <div class="bar-label">
                    <span>${scaleName}</span>
                    <span>${value} / ${max} (норма: ${norm})</span>
                </div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                    <div class="bar-marker" style="left: ${(norm/max)*100}%">
                        <span class="norm-marker">норма</span>
                    </div>
                </div>
            </div>
        `;
        
        // Формируем интерпретацию
        if (value > norm * 1.3) {
            interpretationText += `${scaleName}: высокий уровень. `;
        } else if (value < norm * 0.7) {
            interpretationText += `${scaleName}: низкий уровень. `;
        } else {
            interpretationText += `${scaleName}: в пределах нормы. `;
        }
    }
    
    barsContainer.innerHTML = barsHtml;
    interpretationEl.textContent = interpretationText;
}

// Функция создания PDF
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    
    // Заголовок
    doc.setFontSize(20);
    doc.setTextColor(52, 152, 219);
    doc.text('Результаты исследования пищевых привычек', 20, yPos);
    
    yPos += 15;
    
    // Информация о респонденте
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Возраст: ${answers.demographics.age}`, 20, yPos);
    yPos += 7;
    doc.text(`Пол: ${answers.demographics.gender === 'female' ? 'Женский' : 'Мужской'}`, 20, yPos);
    yPos += 7;
    doc.text(`ИМТ: ${calculateBMI(answers.demographics)}`, 20, yPos);
    
    yPos += 15;
    
    // Результаты по опросникам
    const scores = calculateScaleScores();
    
    for (let q = 1; q <= 5; q++) {
        // Проверяем, не выходим ли за пределы страницы
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(52, 152, 219);
        doc.text(`Опросник ${q}: ${questionnaires[`q${q}`].title}`, 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        for (let [scaleName, value] of Object.entries(scores[`q${q}`].scales)) {
            doc.text(`${scaleName}: ${value} баллов`, 30, yPos);
            yPos += 6;
        }
        
        yPos += 10;
    }
    
    // Интерпретация
    doc.addPage();
    yPos = 20;
    doc.setFontSize(16);
    doc.setTextColor(52, 152, 219);
    doc.text('Интерпретация результатов', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const interpretation = generateInterpretation(scores);
    const lines = doc.splitTextToSize(interpretation, 170);
    doc.text(lines, 20, yPos);
    
    // Сохраняем PDF
    doc.save('результаты_исследования.pdf');
}

// Расчет ИМТ
function calculateBMI(demo) {
    const heightInM = demo.height / 100;
    const bmi = demo.weight / (heightInM * heightInM);
    return bmi.toFixed(1);
}

// Генерация интерпретации
function generateInterpretation(scores) {
    let text = 'На основе проведенного исследования можно сделать следующие выводы:\n\n';
    
    // Анализ по каждому опроснику
    for (let q = 1; q <= 5; q++) {
        text += `${questionnaires[`q${q}`].title}:\n`;
        
        for (let [scaleName, value] of Object.entries(scores[`q${q}`].scales)) {
            const norm = questionnaires[`q${q}`].scales[scaleName]?.norm || 5;
            
            if (value > norm * 1.3) {
                text += `- ${scaleName}: повышенный уровень. `;
                if (q === 1) text += 'Рекомендуется обратить внимание на эмоциональные аспекты питания.\n';
            } else if (value < norm * 0.7) {
                text += `- ${scaleName}: пониженный уровень. `;
                if (q === 3) text += 'Может указывать на позитивное отношение к телу.\n';
            } else {
                text += `- ${scaleName}: в пределах нормы.\n`;
            }
        }
        text += '\n';
    }
    
    text += 'Рекомендации:\n';
    text += '1. При повышенных показателях рекомендуется консультация специалиста\n';
    text += '2. Обратите внимание на осознанность в питании\n';
    text += '3. Практикуйте интуитивное питание\n';
    text += '4. При необходимости обратитесь к психологу или диетологу';
    
    return text;
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Существующие обработчики...
    
    // Новый обработчик для PDF
    document.getElementById('downloadPDF').addEventListener('click', generatePDF);
    
    // Обработчик для отправки на почту
    document.getElementById('emailResults').addEventListener('click', () => {
        const email = prompt('Введите ваш email для получения результатов:');
        if (email) {
            alert(`Результаты будут отправлены на ${email} в ближайшее время.`);
            // Здесь можно добавить реальную отправку на сервер
        }
    });
    
    // Перезапуск с экрана результатов
    document.getElementById('restartFromResults').addEventListener('click', () => {
        // Сброс всех данных
        answers = {
            demographics: {},
            q1: {}, q2: {}, q3: {}, q4: {}, q5: {}
        };
        
        // Сброс прогресса
        document.querySelectorAll('.progress').forEach(p => p.style.width = '0%');
        document.querySelectorAll('[id^="next-to"], #finish-survey').forEach(btn => {
            btn.style.display = 'none';
        });
        
        showScreen('welcome-screen');
    });
});

// Обновите финальный экран, чтобы вел к результатам
document.getElementById('finish-survey').addEventListener('click', () => {
    saveAnswers('q5');
    showScreen('results-screen'); // Вместо finish-screen показываем результаты
});