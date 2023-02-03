import { useState, useEffect } from 'react';

export const useCounter = (start = 0) => { 
  // set the state
  const [counter, setCounter] = useState(start);
  
  // use the effect whenever counter changes
  useEffect(() => {
    if (isPrime(counter)) {
      document.body.style.backgroundImage = 'linear-gradient(to right, coral, teal)';
    } else {
      document.body.style.backgroundImage = "";
    }
  }, [counter]);

  const increment = () => { setCounter(counter + 1)};
  const decrement = () => { setCounter(counter - 1)};

  return [counter, increment, decrement] as const;
}


// Helper function for the custom hook
const isPrime = (num : number) => {
  num = num < 0 ? -num : num;
  const squareRoot = Math.sqrt(num)
  for (let i = 2; i <= squareRoot; i++) {
    if (num % i === 0) {
      return false; 
    }
  }
  return num > 1;
}