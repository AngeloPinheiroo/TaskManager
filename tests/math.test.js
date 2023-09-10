const {calculateTip, fahrenheitToCelsius, celciusToFahrenheit, add} = require('../src/math')

test('Tip calculation', function(){
    const total = calculateTip(10, 0.3);

    expect(total).toBe(13);
})

test('Tip calculation with default', function(){
    const total = calculateTip(10);

    expect(total).toBe(12.5);
})

test('Fahrenheit to Celsius', function(){
    const temp = fahrenheitToCelsius(32);

    expect(temp).toBe(0);
})

test('Celcius to Fahrenheit', function(){
    const temp = celciusToFahrenheit(0);

    expect(temp).toBe(32);
})

/* test('Async test demo', function(done){
    setTimeout(function(){
        expect(1).toBe(2);
        done()
    }, 2000)
}) */

test('Add function', function(done){
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done()
    })
})

test('Add function async/await', async function(){
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
    })
})