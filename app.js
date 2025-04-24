const videoElement = document.getElementById('videoElement');
const analyzeButton = document.getElementById('analyzeButton');
const resultDiv = document.getElementById('result');

// Функция для получения доступа к камере
async function getCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'  // Запрашиваем заднюю камеру
      }
    });
    videoElement.srcObject = stream; // Отображаем видеопоток
  } catch (error) {
    alert('Не удалось получить доступ к камере: ' + error);
  }
}

// Функция для обработки анализа изображения
async function analyzeImage() {
  resultDiv.textContent = "Идет анализ..."; // Пока не будет результата, отображаем текст

  // Снимем кадр с видео
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Преобразуем изображение в base64
  const imageData = canvas.toDataURL('image/jpeg');

  // Отправляем изображение на сервер для анализа (необходимо настроить сервер или использовать API нейросети)
  const result = await analyzeWithNeuralNetwork(imageData);

  // Выводим результат
  resultDiv.textContent = `Это: ${result}`;
}

// Функция для отправки изображения на нейросеть
async function analyzeWithNeuralNetwork(imageData) {
  // Здесь будет код для работы с нейросетью, например, через API (предполагается серверная часть)
  // Для примера вернем случайный результат
  return "Кошка";
}

// Запрашиваем доступ к камере при загрузке страницы
getCamera();

// Добавляем обработчик для кнопки
analyzeButton.addEventListener('click', analyzeImage);
