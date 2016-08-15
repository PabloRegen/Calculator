(function calculator() {

    var entries = [],                                      // store numbers and math symbols. String type
        temp = '',                                         // store numbers. String type
        total,                                             // numbers type
        val,                                               // catch & store just clicked button value. String type
        flag_temp = true,                                  // control chain operations depending on whether '=' was just clicked
        buttons = document.getElementsByTagName('button'), // store array-like collection of buttons
        sound = document.getElementsByTagName('audio'),    // store array-like collection of sounds
        display = document.getElementById('display');      // display i/o


    function playSound(val) {
        if (val === '=') { sound[1].play(); }
        else { sound[0].play(); }
    }


    function displaySomething(something) { // fit number on display & swap '-' to properly display rtl direction
        if (something > 999999999) { display.value = something.toExponential(6); }
        else if (something < -999999999) { display.value = something.toExponential(6).slice(1) + '-'; }
        else if (something >= 0) {
            if (something % 1 === 0) { display.value = String(something); } // integer
            else { display.value = something.toFixed(2); }
        } else {
            if (something % 1 === 0) { display.value = (String(Math.abs(something)) + '-'); }
            else { display.value = (Math.abs(something).toFixed(2) + '-'); }
        }
    }


    function buttonClick() {    // called with each click
        val = this.textContent; // catch just clicked button value

        playSound(val);
            
        if (!isNaN(val)) {   // got a number!
            if (flag_temp) { // '=' was not just clicked -> allow chain operations
                if (val !== '0' || (val === '0' && (temp[0] !== '0' || (temp[0] === '0' && temp[1] === '.')))) {           // avoid repeating 0 at number's start
                    if ((temp.indexOf('.') === -1 && temp.length < 9) || (temp.indexOf('.') !== -1 && temp.length < 10)) { // limit digits qty
                        temp += val;
                        if (temp[0] === '.') { display.value = temp.slice(1) + '.'; }
                        else if (temp[0] === '-') { display.value = temp.slice(1) + '-'; }
                        else { display.value = temp; }
                    }
                }
            } else { // '=' was just clicked -> disallow chain operations by reassigning new value to temp
                temp = val;
                display.value = temp;
            }
            flag_temp = true;

        } else {
            switch (val) {

                case '.':
                    if (flag_temp) {                        // '=' was not just clicked -> allow chain operations
                        if (temp.length < 10) {             // limit digits qty
                            if (temp.indexOf('.') === -1) { // avoid repeating '.'
                                display.value = '.' + temp;
                                temp += val;
                            }
                        }
                    } else { // '=' was just clicked -> disallow chain operations by reassigning new value to temp
                        temp = val;
                        display.value = temp;
                    }
                    flag_temp = true;
                    break;

                case '+/-': // change sign. Do not modify flag_temp value!
                    if (temp !== '' && temp !== '0' && temp !== '.') {
                        temp = +temp * -1;
                        displaySomething(temp);
                        temp = String(temp);
                    }
                    break;

                case 'AC': // restart from scratch
                    entries = [];
                    temp = '';
                    display.value = '0';
                    flag_temp = true;
                    break;

                case 'CE': // clear only last entry
                    temp = '';
                    display.value = '0';
                    flag_temp = true; // not really needed
                    break;

                case '+': // push temp (or 0 is temp is empty) and symbol to calculate total from entries array
                case '-': // or substitute last operation for current one if symbols are clicked in a row
                case '/':
                case 'x':
                    if (temp !== '') {
                        entries.push(temp, val);
                    } else {
                        if (entries.length === 0) { entries.push('0', val); }
                        else { entries[entries.length-1] = val; }
                    }
                    temp = '';
                    display.value = val;
                    flag_temp = true;
                    break;

                case '=': // Let's do math!
                    entries.push(temp); // if no number was entered after + - x or / then temp = '' and it will coerce to 0 when converting to number

                    total = +entries[0] // initialize total with 1st string of entries and calculate its value by looping thru the numbers and symbols
                    for (var i = 1; i < entries.length - 1; i += 2) {
                        if (entries[i] === '+') { total += +entries[i+1]; }
                        else if (entries[i] === '-') { total -= +entries[i+1]; }
                        else if (entries[i] === 'x') { total *= +entries[i+1]; }
                        else if (entries[i] === '/') { total /= +entries[i+1]; }
                    }

                    if (isNaN(total)) { display.value = 'Error'; } // address NaN cases (i.e. infinity * 0 and operations with NaN values)
                    else { displaySomething(total); }

                    entries = [];
                    temp = String(total); // in case chain operations are called
                    flag_temp = false;    // control chain operations when clicking numbers or '.' next
                    break;
            }
        }
    }

    for (var j = 0; j < buttons.length; j++) {             // add 'click' handler & function buttonClick to buttons
        buttons[j].addEventListener('click', buttonClick)  // or: buttons[j].addEventListener('click', function(event) {
    }                                                      //     var val = this.textContent;
                                                           //     ... do the stuff under buttonClick() ... }
}());