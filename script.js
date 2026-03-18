// Самый простой скрипт для проверки
console.log("Скрипт загрузился!");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Страница загружена");
    
    // Находим кнопку "Да"
    const yesButton = document.getElementById('consent-yes');
    console.log("Кнопка 'Да' найдена?", yesButton);
    
    if (yesButton) {
        yesButton.addEventListener('click', function() {
            console.log("Кнопка нажата!");
            alert("Кнопка работает!");
        });
    } else {
        console.error("Кнопка 'Да' не найдена в DOM");
    }
});
