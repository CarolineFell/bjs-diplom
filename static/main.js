'use strict'
//////////////////////////////// --- Part 1 --- ////////////////////////////////

class Profile {
    constructor({username, name: {firstName, lastName}, password}) {
        this.username = username;
        this.name = {firstName, lastName}
        this.password = password;
    }

    // Реализуйте метод Добавление нового пользователя — метод вызывается с данными, полученными из конструктора класса.
    createUser(callback) {
        console.log(`Creating user ${this.username}`);
        return ApiConnector.createUser({ username: this.username, name: { firstName: this.name.firstName, lastName : this.name.lastName }, password: this.password }, (error, data) => {
            callback(error, data);
        });
    }

    // Реализуйте метод Авторизация — метод вызывается с данными, полученными из конструктора класса.
    performLogin(callback) {
        console.log(`Authorizing user ${this.username}`);
        return ApiConnector.performLogin({ username: this.username, password: this.password }, (error, data) => {
            callback(error, data);
        })
    }

    /*Реализуйте метод Добавление денег в личный кошелек — метод принимает на вход объект с двумя ключами: 
      валюта (строка) и количество денег (число).*/
    addMoney({ currency, amount }, callback) {
        console.log(`Adding ${amount} of ${currency} to ${this.username}`);
        return ApiConnector.addMoney({ currency, amount }, (error, data) => {
            callback(error, data);
        });
    }

    /*Реализуйте метод Конвертация валют — метод принимает на вход объект с тремя ключами: из какой валюты 
    конвертируем (строка), в какую валюту конвертируем (строка), конвертированная (целевая) сумма (число).*/
    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
        return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (error, data) => {
            callback(error, data);
        })
    }
    
    // Реализуйте метод Перевод токенов другому пользователю — метод принимает на вход объект с двумя ключами: кому (строка, имя пользователя), количество денег (число).
    transferMoney({ to, amount }, callback) {
        console.log(`Transfering ${amount} of Netcoins to ${to}`);
        return ApiConnector.transferMoney({ to, amount }, (error, data) => {
            callback(error, data);
        })
    }
}

// Реализуйте функцию получения курса валют с сервера. Возвращает массив из 100 объектов.
function getStocks(callback) {
    console.log('Getting stocks info')
    ApiConnector.getStocks(( response, responseBody ) => {
        callback(responseBody);
    });
}

//////////////////////////////// --- Part 2 --- ////////////////////////////////

function main() {
    // Внутри функции объявите две переменные с экземплярами класса Profile.
    const noName = new Profile({
                        username: 'noName',
                        name: {firstName: 'Lisa', lastName: 'Semenova'},
                        password: 'lisa123---456'
                    });
    
    const supreme = new Profile({
                        username: 'supreme',
                        name: {firstName: 'Lev', lastName: 'Petrov'},
                        password: 'petr0v.me'
                    });
    
    // Вызовите метод создания пользователя для одной из созданых переменных. 
    noName.createUser((error, data) => {
        if (error) {
            console.error(`Error during creating ${noName.username}`);
        } else {
            console.log(`${noName.username} is created!`);
        }
        
        // В случае удачного создания пользователя вызовите метод авторизации для того же пользователя, которого вы только что создали.
        noName.performLogin((error, data) => {
            if (error) {
                console.error(`Error during authorizing ${noName.username}`);
            } else {
                console.log(`${noName.username} is authorized!`);
            }

            const moneyToAdd = { currency: 'RUB', amount: 9000 };

            // В случае удачной авторизации вызовите метод добавления денег на счёт для авторизованного пользователя.
            noName.addMoney(moneyToAdd, (error, data) => { 
                if (error) {
                    console.error(`Error during adding money to ${noName.username}`);
                } else {
                    console.log(`Added ${moneyToAdd.amount} of ${moneyToAdd.currency} to ${noName.username}`);
                }

                // В случае удачного добавления денег на счёт вызовите метод конвертации денег из текущей валюты в Неткоины. 
                // Обратите внимание, что для корректной работы метода необходимо передавать уже конвертированную (целевую) сумму. 
                // Для вычисления конвертированной суммы получите курс текущей валюты к Неткоину с помощью функции получения курса валют с сервера.
                
                getStocks((stocks) => {
                    let currency = parseInt(stocks[0].NETCOIN_RUB);
                    let amountToGet = moneyToAdd.amount / currency;
                
                    noName.convertMoney({ fromCurrency: moneyToAdd.currency, targetCurrency: 'NETCOIN', targetAmount: amountToGet }, (error, data) => {
                        if (error) {
                            console.error(`Error during converting money to ${noName.username}`);
                        } else {
                            console.log(`Converted to coins`);
                            console.log(data);
                        }

// В случае удачной конвертации вызовите метод создания второго пользователя, используя вторую переменную с экземпляром класса Profile.
                        supreme.createUser((error, data) => {
                            if (error) {
                                console.error(`Error during creating ${supreme.username}`);
                            } else {
                                console.log(`${supreme.username} is created!`);
                            }

                            const amountToTransfer = { to: 'supreme', amount: amountToGet };

// После удачного создания второго пользователя вызовите метод перевода денег у первого пользователя.
                            noName.transferMoney(amountToTransfer, (error, data) => {
                                if (error) {
                                    console.error(`Error during transfering to ${amountToTransfer.to}`);
                                } else {
                                    console.log(`${amountToTransfer.to} has got ${amountToTransfer.amount} of Netcoins`);
                                }
                            })
                        })
                    })
                })
            })
        })
    })
}

// В конце файла вызовите функцию.
main();