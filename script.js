"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
console.log(accounts);
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}`;

  const itrest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, intrest) => acc + intrest, 0);
  labelSumInterest.textContent = `${itrest}`;
};

const createUsernames = function (allAccounts) {
  allAccounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (currentAccount) {
  // Disply Movements
  displayMovements(currentAccount.movements);
  // Display Balance
  calcDisplayBalance(currentAccount);
  // Display Summary
  calcDisplaySummary(currentAccount);
};

//// Event handler

/////////////// LOGIN \\\\\\\\\\\\\\\

let currentAccount;
btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    // Udate UI
    updateUI(currentAccount);
  }
});

///////////////TRANSFER \\\\\\\\\\\\\\\

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Udate UI
    updateUI(currentAccount);
  }
});

/////////////// LOAN \\\\\\\\\\\\\\\
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    // at least one of the movements is greater than 10 precent of the loan
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movements
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
    // Clear Inputa
    inputLoanAmount.value = "";
  }
});

/////////////// CLOSE ACCOUNT \\\\\\\\\\\\\\\
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Delete");

  if (
    currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete acount
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

/////////////// SORT BUTTON \\\\\\\\\\\\\\\
let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES;

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////// Practice //////////////////////////
// 1)
const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((sum, mov) => sum + mov, 0);
console.log(bankDepositSum);
// 1) only with reduce:
const bankDepositSumReduce = accounts
  .flatMap((acc) => acc.movements)
  .reduce((sum, mov) => (mov > 0 ? sum + mov : sum), 0);
console.log(bankDepositSumReduce);

// 2)
const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => (mov >= 1000 ? ++acc : acc), 0);
console.log(numDeposits1000);

// 3) Advanced Reduce method
const sums = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // 1st way:
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // 2nd way:
      sums[cur > 0 ? "deposits" : "withdrawals"] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// 4) This Is a Nice Title
const convertTitleCase = function (title) {
  // making the first word in the sentence to uppercase function:
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

  const exceptions = ["a", "and", "an", "the", "but", "or", "on", "in", "with"];

  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  return capitalize(titleCase);
};

console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title but not too long"));
console.log(convertTitleCase("and is another title with an EXAMPLE"));

/////////////////////////////////////////////////
/*

let arr = ['a', 'b', 'c', 'd', 'e'];
//// Slice (will return a new array)
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
// 2 ways of how to make a copy of the original array:
console.log(arr.slice());
console.log([...arr]);

//// Splice (will mutate the original array)
console.log(arr.splice(2));
console.log(arr);
arr.splice(-1);
console.log(arr);
// if we give splice 2 parameters ==> (starts from this index, how many to delete)
const newArr = [2, 5, 6, 4, 7, 8];
newArr.splice(2, 3);
console.log(newArr);

//// Reverse (will mutate the original array)
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

//// Concat
const letters = arr.concat(arr2);
console.log(letters);
// we can get the same result with spread too:
console.log([...arr, ...arr2]);

//// Jojn
console.log(letters.join(' - '));

//// At
const array = [23, 11, 64];
console.log(array.at(0));
// same as:
console.log(array[0]);
// but getting the last elemnts is hard with these 2 older ways:
console.log(array[arr.length - 1]);
console.log(array.slice(-1)[0]);
// with At its easier:
console.log(array.at(-1));
console.log(array.at(-2));
// At also works on strings:
console.log('jonas'.at(0));
console.log('jonas'.at(-1));

//// For Each on arryas
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// arrayThatWeWantToLoopOver.forEach(function (1st is Element, 2nd is the index of elemnt, 3rd is the whole array))
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${mov}`);
  }
});


//// Map method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// Shorter way to write map method:
const movementsUSD = movements.map(mov => mov * eurToUsd);
console.log(movements, movementsUSD);
// Like foreach, we can give it 3 arguments: (1st is Element, 2nd is the index of elemnt, 3rd is the whole array) "we can omit index or array if we want to: "
const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);


//// Filter method
// (1st is Element, 2nd is the index of elemnt, 3rd is the whole array)
// "we can omit index or array if we want to: "
// ex)
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);
// ex)
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);


// Reduce method
// (1st is Accumulator, 2nd is the elemnt, 3rd index, 4th array) and after function we
// should declare an initial value. "Important"
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);
// ex) how to get Maximum number with reduce
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
});
console.log(max);


//// Find method
// It returns the first matching element 
// (note that it doesn't return array but one elemnt)
// ex)
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);
console.log(accounts);
// ex)
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);


//// FindeIndex method
// It returns the first matching element's Index 
// (note that it doesn't return array but one number)
// ex) "copied from a project so the code desnt work here"
// const index = accounts.findIndex(
  //   (acc) => acc.username === currentAccount.username
  // );
// Calling it Returns a number like 0 or 3
  

//// Some
// returns true when given condition is met for at least one of the elemnts in the array
// and false otherwise
// ex)
movements.some((mov) => mov > 0);

//// Every
// returns true when given condition is met for ALL of the elemnts in the array
// and false otherwise
// ex)
console.log(account4.movements.every((mov) => mov > 0));


// Separate callback (for "DRY = dont repeat yourself" in coding)
// ex)
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//// Flat method
// adds all of the elements and nested elements of array
// .flat(how deep we want to flat. default = 1 "Levels deep")
// ex)
const arr = [[1, 2, 3], [4, [5], 6], 7, 8];
console.log(arr.flat(1));
// returns: [1, 2, 3, 4, Array(1), 6, 7, 8]
console.log(arr.flat(2));
// returns: [1, 2, 3, 4, 5, 6, 7, 8]
// ex)
const overalBalance1 = accounts
.map((acc) => acc.movements)
.flat()
.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance1);

//// FlatMap
// basically its the flat and map methods, in one go
// note that we can only get 1 level deep for flat method,
// if we want to go deeper we should use flat and map seperatly.
// ex)
const overalBalance2 = accounts
.flatMap((acc) => acc)
.reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);


//// Sort
// (this will mutate the original array)
// Strings
const owners = ["Jonas", "Zack", "Adam", "Martha"];
console.log(owners.sort());

// Numbers
const exampleNumbers = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Return <0 A,B (Keep order)
// Return >0 B,A (Switch order)

// Ascending
exampleNumbers.sort((a, b) => a - b);
console.log(exampleNumbers);

// Descending
exampleNumbers.sort((a, b) => b - a);
console.log(exampleNumbers);

//// Fill method
const arr = [1, 2, 3, 4, 5, 6, 7];
// .fill(1st: Element that we want to replace, 2nd: Starting replacing from, 3rd: finish replacing here )
arr.fill("H", 3, 5);
console.log(arr);
//Returns: [1, 2, 3, 'H', 'H', 6, 7]

// Empty array + fill method
const x = new Array(7); // creat's an array with 7 empty sluts
x.fill(1);
console.log(x);
// Returns: [1, 1, 1, 1, 1, 1, 1]

//// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
// Returns: [1, 1, 1, 1, 1, 1, 1]
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);
// Returns: [1, 2, 3, 4, 5, 6, 7]
// ex) creating 100 random dice rolls:
console.log(
  Array.from({ length: 100 }, (_, i) => Math.trunc(Math.random() * 7))
  );
  // Returns: [3, 2, 3, 3, 3, 1, 4, 0, 2, 5, 6, 4, 6, 2, 5, 6, 6, 5, 2, 4, 6, 6, 6, 5, 5, 1, 6, 2, 5, 4, 0, 3, 2, 3, 4, 1, 6, 0, 3, 0, 1, 4, 0, 4, 3, 6, 2, 1, 5, 4, 5, 2, 3, 0, 3, 0, 2, 0, 4, 1, 2, 3, 3, 6, 2, 5, 1, 6, 4, 0, 6, 0, 6, 3, 3, 2, 2, 0, 6, 3, 2, 6, 0, 4, 3, 2, 1, 1, 1, 3, 2, 0, 6, 6, 6, 4, 3, 5, 6, 5]
  
  
*/
// Using Array.from to making an array of movements when we click on logo
// "we get the movement data from html directly not from objects above"
// "only to show the power of Array.from "
const logo = document.querySelector(".logo");

logo.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent)
  );
  console.log(movementsUI);
});
