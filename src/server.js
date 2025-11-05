const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка транспорта для отправки почты
const transporter = nodemailer.createTransporter({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true, // true для 465 порта, false для других портов
    auth: {
        user: 'taras.chernov@mail.ru', // ваша почта
        pass: 'your_password_here'     // пароль от почты или пароль приложения
    }
});

// Проверка подключения к SMTP
transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send messages');
    }
});

// Роут для обработки заказов
app.post('/send-order', async (req, res) => {
    try {
        const { name, email, phone, comment, configuration } = req.body;

        // Валидация обязательных полей
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Заполните обязательные поля: имя, email и телефон'
            });
        }

        // Формируем текст письма
        const subject = `Новый заказ от ${name}`;
        
        let message = `
НОВЫЙ ЗАКАЗ С САЙТА

Контактная информация:
├ Имя: ${name}
├ Email: ${email}
└ Телефон: ${phone}

Детали заказа:
`;

        // Добавляем информацию о конфигурации
        if (configuration.processor) {
            message += `├ Процессор: ${configuration.processor}\n`;
        }
        if (configuration.cores) {
            message += `├ Количество ядер: ${configuration.cores}\n`;
        }
        if (configuration.ram) {
            message += `├ Оперативная память: ${configuration.ram} ГБ\n`;
        }
        if (configuration.storage) {
            message += `├ Хранилище: ${configuration.storage} ГБ\n`;
        }
        if (configuration.storageType) {
            message += `├ Тип хранилища: ${configuration.storageType}\n`;
        }
        if (configuration.backup) {
            message += `├ Резервное копирование: ${configuration.backup}\n`;
        }
        if (configuration.total) {
            message += `└ Итоговая стоимость: ${configuration.total}\n`;
        }

        message += `\nКомментарий: ${comment || 'Не указан'}\n\n`;
        message += `Дата заказа: ${new Date().toLocaleString('ru-RU')}`;

        // Настройки письма
        const mailOptions = {
            from: '"Конфигуратор HostProv" <taras.chernov@mail.ru>',
            to: 'taras.chernov@mail.ru',
            subject: subject,
            text: message,
            replyTo: email
        };

        // Отправка письма
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent:', info.messageId);
        
        res.json({
            success: true,
            message: 'Заказ успешно отправлен',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при отправке заказа',
            error: error.message
        });
    }
});

// Роут для проверки работы сервера
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});