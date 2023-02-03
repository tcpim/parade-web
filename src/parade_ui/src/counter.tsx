import React, { useState, useEffect } from 'react';
import { useCounter } from './useCounter';

export const Counter = () => {
  // set the state
  const [counter, increment, decrement] = useCounter();
  
//   // use the effect whenever counter changes
//   useEffect(() => {
//     if (isPrime(counter)) {
//       document.body.style.backgroundImage = 'linear-gradient(to right, coral, teal)';
//     } else {
//       document.body.style.backgroundImage = "";
//     }
//   }, [counter]);

//   // create an easy-to-use increment function
//   const increment = () => { setCounter(counter + 1)};

  return (  
    <div>
      <h2>Count: {counter}</h2>
      <button onClick={increment}>Shaw</button>
      <button onClick={decrement}>Lou</button>
    </div>
  )
}


// Helper function for the custom hook
const isPrime = (num : number) => {
  const squareRoot = Math.sqrt(num)
  for (let i = 2; i <= squareRoot; i++) {
    if (num % i === 0) {
      return false; 
    }
  }
  return num > 1;
}
