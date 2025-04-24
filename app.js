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

  // Отправляем изображение на сервер Google Vision API для анализа
  const result = await analyzeWithGoogleVision(imageData);

  // Выводим результат
  resultDiv.textContent = `Это: ${result}`;
}

// Функция для отправки изображения на Google Vision API
async function analyzeWithGoogleVision(imageData) {
  const apiKey = 'AIzaSyAeg3tYDNBfN4xN_GTcopb7IPTWPyrcw40';  // Ваш новый API-ключ

  try {
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageData.split(',')[1]  // Отправляем base64-encoded изображение
            },
            features: [
              { type: "LABEL_DETECTION", maxResults: 1 }  // Используем LABEL_DETECTION для распознавания объектов
            ]
          }
        ]
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    
    // Проверяем, есть ли результаты
    if (data.responses && data.responses[0].labelAnnotations && data.responses[0].labelAnnotations.length > 0) {
      const label = data.responses[0].labelAnnotations[0].description;
      return label;
    } else {
      return "Не удалось распознать объект.";
    }
  } catch (error) {
    console.error('Ошибка при запросе к API:', error);
    return "Произошла ошибка при анализе изображения.";
  }
}

// Запрашиваем доступ к камере при загрузке страницы
getCamera();

// Добавляем обработчик для кнопки
analyzeButton.addEventListener('click', analyzeImage);
