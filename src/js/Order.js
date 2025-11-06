// Базовая конфигурация
        let config = {
            processor: 'xeon-gold',
            processorPrice: 5000,
            cores: 8,
            coresPrice: 4000,
            ram: 32,
            ramQuantity: 1,
            ramPrice: 2400,
            storage: 500,
            storageQuantity: 1,
            storageType: 'nvme',
            storageMultiplier: 1.5,
            baseStoragePrice: 1125
        };

        // Элементы DOM
        const totalPriceElement = document.getElementById('totalPrice');
        const orderBtn = document.getElementById('orderBtn');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModalBtn = document.getElementById('closeModal');
        const orderForm = document.getElementById('orderForm');

        // Элементы для отображения в модальном окне
        const orderProcessor = document.getElementById('orderProcessor');
        const orderCores = document.getElementById('orderCores');
        const orderRam = document.getElementById('orderRam');
        const orderStorage = document.getElementById('orderStorage');
        const orderTotal = document.getElementById('orderTotal');

        // Функция расчета общей стоимости
        function calculateTotal() {
            const processorCost = config.processorPrice;
            const coresCost = config.coresPrice;
            const ramCost = config.ramPrice * config.ramQuantity;
            const storageCost = config.baseStoragePrice * config.storageQuantity * config.storageMultiplier;
            
            const total = processorCost + coresCost + ramCost + storageCost;
            return total;
        }

        // Функция обновления отображения
        function updateDisplay() {
            // Обновляем основное отображение
            document.getElementById('configProcessor').textContent = getProcessorName(config.processor);
            document.getElementById('configCores').textContent = config.cores + ' ядер';
            document.getElementById('configRam').textContent = (config.ram * config.ramQuantity) + ' ГБ';
            document.getElementById('configStorage').textContent = (config.storage * config.storageQuantity) + ' ГБ ' + getStorageTypeName(config.storageType);
            
            // Обновляем цены в правой колонке
            document.querySelector('.configuration-section .config-item:nth-child(2) .config-price').textContent = config.coresPrice + ' ₽';
            document.querySelector('.configuration-section .config-item:nth-child(4) .config-price').textContent = (config.ramPrice * config.ramQuantity) + ' ₽';
            document.querySelector('.configuration-section .config-item:nth-child(5) .config-price').textContent = (config.baseStoragePrice * config.storageQuantity * config.storageMultiplier).toFixed(0) + ' ₽';
            
            // Обновляем общую стоимость
            const total = calculateTotal();
            totalPriceElement.textContent = total.toLocaleString('ru-RU') + ' ₽';
        }

        // Функция обновления модального окна
        function updateOrderModal() {
            orderProcessor.textContent = getProcessorName(config.processor);
            orderCores.textContent = config.cores + ' ядер';
            orderRam.textContent = (config.ram * config.ramQuantity) + ' ГБ';
            orderStorage.textContent = (config.storage * config.storageQuantity) + ' ГБ ' + getStorageTypeName(config.storageType);
            orderTotal.textContent = calculateTotal().toLocaleString('ru-RU') + ' ₽';
        }

        // Вспомогательные функции
        function getProcessorName(type) {
            const processors = {
                'xeon-gold': 'Xeon Gold 6248R',
                'xeon-silver': 'Xeon Silver 4214',
                'amd-epyc': 'AMD EPYC 7343'
            };
            return processors[type];
        }

        function getStorageTypeName(type) {
            const types = {
                'nvme': 'SSD NVMe',
                'sata': 'SATA SSD',
                'hdd': 'HDD'
            };
            return types[type];
        }

        // Обработчики событий для процессоров
        document.querySelectorAll('.processor-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.processor-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                config.processor = this.dataset.processor;
                config.processorPrice = parseInt(this.dataset.price);
                config.cores = parseInt(this.dataset.cores);
                config.coresPrice = config.cores * 500;
                
                // Обновляем отображение количества ядер
                document.getElementById('coresQuantity').textContent = config.cores;
                
                updateDisplay();
            });
        });

        // Обработчики для кнопок количества ядер
        document.querySelectorAll('.cores-section .quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const isPlus = this.classList.contains('plus');
                
                if (isPlus && config.cores < 32) {
                    config.cores += 4;
                }
                if (!isPlus && config.cores > 4) {
                    config.cores -= 4;
                }
                
                config.coresPrice = config.cores * 500;
                document.getElementById('coresQuantity').textContent = config.cores;
                updateDisplay();
            });
        });

        // Обработчики для кнопок количества RAM и Storage
        document.querySelectorAll('.quantity-btn:not(.cores-section .quantity-btn)').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                const isPlus = this.classList.contains('plus');
                
                switch(type) {
                    case 'ram':
                        if (isPlus && config.ramQuantity < 8) config.ramQuantity++;
                        if (!isPlus && config.ramQuantity > 1) config.ramQuantity--;
                        document.getElementById('ramQuantity').textContent = config.ramQuantity;
                        break;
                    case 'storage':
                        if (isPlus && config.storageQuantity < 10) config.storageQuantity++;
                        if (!isPlus && config.storageQuantity > 1) config.storageQuantity--;
                        document.getElementById('storageQuantity').textContent = config.storageQuantity;
                        break;
                }
                
                updateDisplay();
            });
        });

        // Обработчики для типа хранилища
        document.querySelectorAll('.storage-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.storage-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                config.storageType = this.dataset.type;
                config.storageMultiplier = parseFloat(this.dataset.multiplier);
                updateDisplay();
            });
        });

        // Обработчики модального окна
        orderBtn.addEventListener('click', function() {
            updateOrderModal();
            modalOverlay.classList.add('active');
        });

        closeModalBtn.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
            }
        });

        // Обработчик формы заказа
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                phone: document.getElementById('userPhone').value,
                comment: document.getElementById('userComment').value,
                configuration: {
                    processor: getProcessorName(config.processor),
                    cores: config.cores,
                    ram: config.ram * config.ramQuantity,
                    storage: config.storage * config.storageQuantity,
                    storageType: getStorageTypeName(config.storageType),
                    total: calculateTotal()
                }
            };
            
            console.log('Данные заказа:', formData);
            alert('Заказ отправлен! Мы свяжемся с вами в ближайшее время для подтверждения.');
            modalOverlay.classList.remove('active');
            orderForm.reset();
        });

        // Инициализация
        updateDisplay();






        //-------------------------------------------------------------------------------------------------------------------//

// Функция отправки заказа
async function sendOrder(formData) {
    try {
        const response = await fetch('http://your-server-address:3000/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return false;
    }
}

// Обновите обработчик формы заказа
orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        phone: document.getElementById('userPhone').value,
        comment: document.getElementById('userComment').value,
        configuration: {
            processor: getProcessorName(config.processor),
            cores: config.cores,
            ram: config.ram * config.ramQuantity,
            storage: config.storage * config.storageQuantity,
            storageType: getStorageTypeName(config.storageType),
            total: calculateTotal().toLocaleString('ru-RU') + ' ₽'
        }
    };
    
    // Показываем уведомление о отправке
    const submitBtn = this.querySelector('.submit-order');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Отправляем заказ
    const orderSent = await sendOrder(formData);
    
    if (orderSent) {
        alert('Заказ отправлен! Мы свяжемся с вами в ближайшее время для подтверждения.');
        modalOverlay.classList.remove('active');
        orderForm.reset();
    } else {
        alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.');
    }
    
    // Восстанавливаем кнопку
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
});


//-------------------------------------------------------------------------------------------------------------------------------//


// Конфигурация для дискового пространства
let storageConfig = {
    storageType: 'nvme',
    storageMultiplier: 1.5,
    storageSpace: 500,
    storageSpaceQuantity: 1,
    baseStoragePrice: 1125,
    backup: 'basic',
    backupPrice: 0
};

// Элементы DOM для хранилища
const totalStoragePriceElement = document.getElementById('totalStoragePrice');
const orderStorageBtn = document.getElementById('orderStorageBtn');
const storageModalOverlay = document.getElementById('storageModalOverlay');
const closeStorageModal = document.getElementById('closeStorageModal');
const storageOrderForm = document.getElementById('storageOrderForm');

// Элементы для отображения в модальном окне хранилища
const orderStorageType = document.getElementById('orderStorageType');
const orderStorageSpace = document.getElementById('orderStorageSpace');
const orderBackup = document.getElementById('orderBackup');
const orderStorageTotal = document.getElementById('orderStorageTotal');

// Функция расчета стоимости хранилища
function calculateStorageTotal() {
    const storageCost = storageConfig.baseStoragePrice * storageConfig.storageSpaceQuantity * storageConfig.storageMultiplier;
    const backupCost = storageConfig.backupPrice;
    const total = storageCost + backupCost;
    return total;
}

// Функция обновления отображения хранилища
function updateStorageDisplay() {
    // Обновляем основное отображение
    document.getElementById('configStorageType').textContent = getStorageTypeName(storageConfig.storageType);
    document.getElementById('configStorageSpace').textContent = (storageConfig.storageSpace * storageConfig.storageSpaceQuantity) + ' ГБ';
    document.getElementById('configBackup').textContent = getBackupName(storageConfig.backup);
    
    // Обновляем цены в правой колонке
    const storageCost = storageConfig.baseStoragePrice * storageConfig.storageSpaceQuantity * storageConfig.storageMultiplier;
    document.querySelectorAll('.configuration-section .config-item')[1].querySelector('.config-price').textContent = Math.round(storageCost) + ' ₽';
    document.querySelectorAll('.configuration-section .config-item')[2].querySelector('.config-price').textContent = storageConfig.backupPrice + ' ₽';
    
    // Обновляем общую стоимость
    const total = calculateStorageTotal();
    totalStoragePriceElement.textContent = Math.round(total).toLocaleString('ru-RU') + ' ₽';
}

// Функция обновления модального окна хранилища
function updateStorageOrderModal() {
    orderStorageType.textContent = getStorageTypeName(storageConfig.storageType);
    orderStorageSpace.textContent = (storageConfig.storageSpace * storageConfig.storageSpaceQuantity) + ' ГБ';
    orderBackup.textContent = getBackupName(storageConfig.backup);
    orderStorageTotal.textContent = Math.round(calculateStorageTotal()).toLocaleString('ru-RU') + ' ₽';
}

// Вспомогательные функции для хранилища
function getBackupName(type) {
    const backups = {
        'basic': 'Базовое',
        'advanced': 'Расширенное',
        'premium': 'Премиум'
    };
    return backups[type];
}

// Обработчики для типа хранилища
document.querySelectorAll('.configurator-container:last-child .storage-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.configurator-container:last-child .storage-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        storageConfig.storageType = this.dataset.type;
        storageConfig.storageMultiplier = parseFloat(this.dataset.multiplier);
        updateStorageDisplay();
    });
});

// Обработчики для кнопок количества хранилища
document.querySelectorAll('.quantity-btn[data-type="storage-space"]').forEach(btn => {
    btn.addEventListener('click', function() {
        const isPlus = this.classList.contains('plus');
        
        if (isPlus && storageConfig.storageSpaceQuantity < 20) {
            storageConfig.storageSpaceQuantity++;
        }
        if (!isPlus && storageConfig.storageSpaceQuantity > 1) {
            storageConfig.storageSpaceQuantity--;
        }
        
        document.getElementById('storageSpaceQuantity').textContent = storageConfig.storageSpaceQuantity;
        updateStorageDisplay();
    });
});

// Обработчики для резервного копирования
document.querySelectorAll('.configurator-container:last-child .processor-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.configurator-container:last-child .processor-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        
        storageConfig.backup = this.dataset.backup;
        storageConfig.backupPrice = parseInt(this.dataset.price);
        updateStorageDisplay();
    });
});

// Обработчики модального окна хранилища
orderStorageBtn.addEventListener('click', function() {
    updateStorageOrderModal();
    storageModalOverlay.classList.add('active');
});

closeStorageModal.addEventListener('click', function() {
    storageModalOverlay.classList.remove('active');
});

storageModalOverlay.addEventListener('click', function(e) {
    if (e.target === storageModalOverlay) {
        storageModalOverlay.classList.remove('active');
    }
});

// Обработчик формы заказа хранилища
storageOrderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('storageUserName').value,
        email: document.getElementById('storageUserEmail').value,
        phone: document.getElementById('storageUserPhone').value,
        comment: document.getElementById('storageUserComment').value,
        configuration: {
            storageType: getStorageTypeName(storageConfig.storageType),
            storageSpace: storageConfig.storageSpace * storageConfig.storageSpaceQuantity,
            backup: getBackupName(storageConfig.backup),
            total: Math.round(calculateStorageTotal()).toLocaleString('ru-RU') + ' ₽'
        }
    };
    
    // Показываем уведомление о отправке
    const submitBtn = this.querySelector('.submit-order');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Отправляем заказ
    const orderSent = await sendOrder(formData);
    
    if (orderSent) {
        alert('Заказ отправлен! Мы свяжемся с вами в ближайшее время для подтверждения.');
        storageModalOverlay.classList.remove('active');
        storageOrderForm.reset();
    } else {
        alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.');
    }
    
    // Восстанавливаем кнопку
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
});

// Инициализация хранилища
updateStorageDisplay();



//---------------------------------------------------------------------------------------------------------------------//


