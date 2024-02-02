const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");


//set passwordLength
// iska simple kaam h ki ye password lenght ko UI pe reflect krwata h:

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    // ye formula mere without comma mere width ko represent krega or baaki ka meri jo comma me h i.e. 100% woh meri height ko represent krega:
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
// ye min and max ki range me random integer find krke deta h:
function getRndInteger(min, max) {
    // math.floor aapko value return krega from [0 1) so * max-min so [0,max-min) ,math.floor bcoz number multiply krne ke baad koi floating value bhi aa skti h jo mujhe nhi chahiye and later add min so range becomes [min  max).
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
    // this gives the lowercase letter from the ascii value:
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    // this gives the Uppercase letter from the ascii value:
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}
// check krta h ki konse checkboxes checked h or konse nhi , unke basis pr conditions banai hui h:
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    // to check whether the checkboxes are ticked or not if ticked mark them true:
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
// async because await keyword async function me he kaam krta h:
async function copyContent() {
    // try and catch bcoz to check writetext function return resolve or error if resolve then you have to show the copied text if not then failed:
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
  //to make copy wala span visible (if e make changes in active class using CSS)
  // copied tbhi show hoga jb me use active wali class me add krunga:
    copyMsg.classList.add("active");
  //  mein chahta hu ki kuch copied kuch time ke badd hidden ho jaye:

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method: an method to shuffle
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
// jb bhi aap checkboxes me ticked ya unticked ie.e koi changes krte ho toh aap is function ko call krte ho pure checkboxes ko dobara count krne ke liye:

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    // edge case when passw. length = 1 and checkboxes ticked =3 then password length should be 3.

    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
// to maintain checkboxes:
//  to keep track ki kitne checkbox ticked h:
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    // ab hme UI ke andr bhi toh change dikhana h toh woh kaam handle function krega:
    handleSlider();
})

// for copying from clipboard uspr kuch hona toh chahiye copy krne ke liye:

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition: jo ticked h
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    // passl - fnarrleng ye aapko remaining characters bta dega:

    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password : bcoz pehle uppercase aayega then lowercase fir checkboxes ke according if all checkboxes are ticked toh isse password ka idea lg rha h toh hme shuffle krna hoga to remove the order:
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});