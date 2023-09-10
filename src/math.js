const calculateTip = function(total, tipPercent = 0.25){
    const tip = total * tipPercent;
    return total + tip;
}

const fahrenheitToCelsius = function(temp){
    return (temp - 32) / 1.8;
}

const celciusToFahrenheit = function(temp){
    return (temp * 1.8) + 32;
}

const add = function(a, b){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(a<0 || b < 0) return reject('Numbers must be non-negative')

            resolve(a + b)
        }, 2000)
    })
}

module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celciusToFahrenheit,
    add
}