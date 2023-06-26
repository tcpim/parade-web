import { useEffect, useRef } from "react";

/*
From: https://ui.dev/c/react-query/infinite-queries
Let's start by creating a custom hook that will call a callback when the user scrolls to the bottom of a container. 
We'll pass it an HTML element for the container, a callback, and an offset which lets us fire the callback when the user has scrolled some number of pixels above the bottom.

Listening to the scroll position can add jank to the UI, so we need to make sure we use the passive option on our event listener. 
Also, we have to do a little bit of logic if the user passes in the document object, since it needs to have the event listener attached to it, but you can't access the scroll properties on the document object.

We also use a little trick to make sure our callback doesn't make the useEffect trigger repeatedly without needing useCallback.
We place the callback into a ref and use a different useEffect to update that ref whenever the callback changes. 
Then, in our handleScroll function, we call the function in the ref instead, which saves us from needing to remove and re-add the event listener.
*/
export function useScrollToBottomAction(
  container: any,
  callback: any,
  offset = 0
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleScroll = () => {
      let scrollContainer =
        container === document ? document.scrollingElement : container;
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - offset
      ) {
        callbackRef.current();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [container, offset]);
}

// export function useScrollToTopAction(): (
//   container: any,
//   callback: any,
//   offset: number
// ) => number {
//   const callbackRef = useRef(callback);

//   useEffect(() => {
//     callbackRef.current = callback;
//   }, [callback]);

//   useEffect(() => {
//     if (!container) {
//       console.log("Container is null");
//       return;
//     }

//     const handleScroll = () => {
//       console.log("Handling scroll");
//       let scrollContainer =
//         container === document ? document.scrollingElement : container;

//       // Check if scrolled to the top
//       const isAtTop = scrollContainer.scrollTop <= offset;

//       if (isAtTop) {
//         console.log("Scrolled to top");
//         callbackRef.current();
//       }
//     };

//     container.addEventListener("scroll", handleScroll, { passive: true });

//     return () => {
//       container.removeEventListener("scroll", handleScroll);
//     };
//   }, [container, offset]);

//   return 1;
// }
