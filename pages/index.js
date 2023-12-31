import { useState, useEffect, useRef } from "react";

export default function MoveableDiv() {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [movementTimeout, setMovementTimeout] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const movableRef = useRef(null);
  const borderedDivRefs = [useRef(null), useRef(null), useRef(null)];

  const wouldIntersect = (newTop, newLeft, borderedDiv) => {
    const movable = movableRef.current.getBoundingClientRect();
    const bordered = borderedDiv.getBoundingClientRect();

    if (
      newLeft + movable.width > bordered.left &&
      newLeft < bordered.right &&
      newTop + movable.height > bordered.top &&
      newTop < bordered.bottom
    ) {
      return true;
    }

    return false;
  };

  const checkBoundaries = (newTop, newLeft) => {
    const rocketDimensions = movableRef.current.getBoundingClientRect();

    // Get the dimensions of the window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Check and adjust the top and left values to ensure the rocket remains within the screen
    newTop = Math.min(Math.max(newTop, 0), windowHeight - rocketDimensions.height);
    newLeft = Math.min(Math.max(newLeft, 0), windowWidth - rocketDimensions.width);

    return { newTop, newLeft };
  };

  const handleKeyDown = (event) => {
    setIsMoving(true);
    let newTop = top;
    let newLeft = left;

    switch (event.key) {
      case "ArrowUp":
        newTop = top - 10;
        break;
      case "ArrowDown":
        newTop = top + 10;
        break;
      case "ArrowLeft":
        newLeft = left - 10;
        break;
      case "ArrowRight":
        newLeft = left + 10;
        break;
      case " ":
        const rocketPosition = movableRef.current.getBoundingClientRect();
        const dx = mousePosition.x - (rocketPosition.left + rocketPosition.width / 2);
        const dy = mousePosition.y - (rocketPosition.top + rocketPosition.height / 2);
        const speed = .5;
        newTop += dy * speed;
        newLeft += dx * speed;
        break;
      default:
        break;
    }

    const { newTop: boundedTop, newLeft: boundedLeft } = checkBoundaries(newTop, newLeft);

    for (const divRef of borderedDivRefs) {
      if (wouldIntersect(boundedTop, boundedLeft, divRef.current)) {
        return;
      }
    }

    setTop(boundedTop);
    setLeft(boundedLeft);

    if (movementTimeout) {
      clearTimeout(movementTimeout);
    }
    const timeout = setTimeout(() => {
      setIsMoving(false);
    }, 150);
    setMovementTimeout(timeout);
  };

  useEffect(() => {
    const updateMousePosition = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const computeRotation = () => {
    if (!movableRef.current) {
      return 0;  // return a default value if ref isn't set
    }

    const rocketPosition = movableRef.current.getBoundingClientRect();
    const rocketCenter = {
      x: rocketPosition.left + rocketPosition.width / 2,
      y: rocketPosition.top + rocketPosition.height / 2,
    };

    const dx = mousePosition.x - rocketCenter.x;
    const dy = mousePosition.y - rocketCenter.y;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return angle + 53;  // +90 to adjust since the rocket's default is up
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [top, left]);

  return (
    <div className="w-full min-h-screen flex relative">
      <div
        ref={movableRef}
        className="z-50 movable-rocket"
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          transform: `rotate(${computeRotation()}deg)`
        }}
      >
        <span 
        className="text-2xl"
          style={{ 
            animation: isMoving ? 'pulsate 1.5s infinite' : 'none', 
            display: 'inline-block'
          }}>
          🚀
        </span>
      </div>
      <div className="w-1/2 min-h-screen flex flex-col items-center">
        <div ref={borderedDivRefs[0]} className="border border-black h-10 w-3/4"></div>
      </div>
      <div className="w-1/2 min-h-screen flex flex-col items-center justify-center space-y-24">
        <div ref={borderedDivRefs[1]} className="  w-3/4">Hello World ... [rest of the content] ... Hello World </div>
        <div ref={borderedDivRefs[2]} className="border border-black h-48 w-3/4"></div>
      </div>
    </div>
  );
}


// import { useState, useEffect, useRef } from "react";

// export default function MoveableDiv() {
//   const [top, setTop] = useState(0);
//   const [left, setLeft] = useState(0);
//   const [isMoving, setIsMoving] = useState(false);
//   const [movementTimeout, setMovementTimeout] = useState(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


//   const movableRef = useRef(null);
//   const borderedDivRefs = [useRef(null), useRef(null), useRef(null)];

//   const wouldIntersect = (newTop, newLeft, borderedDiv) => {
//     const movable = movableRef.current.getBoundingClientRect();
//     const bordered = borderedDiv.getBoundingClientRect();

//     if (
//       newLeft + movable.width > bordered.left &&
//       newLeft < bordered.right &&
//       newTop + movable.height > bordered.top &&
//       newTop < bordered.bottom
//     ) {
//       return true;
//     }

//     return false;
//   };

//   const handleKeyDown = (event) => {
//     setIsMoving(true);
//     let newTop = top;
//     let newLeft = left;

//     switch (event.key) {
//       case "ArrowUp":
//         newTop = top - 10;
//         break;
//       case "ArrowDown":
//         newTop = top + 10;
//         break;
//       case "ArrowLeft":
//         newLeft = left - 10;
//         break;
//       case "ArrowRight":
//         newLeft = left + 10;
//         break;
//         case " ":
//           // Get the current rocket position
//           const rocketPosition = movableRef.current.getBoundingClientRect();

//           // Compute the difference between the rocket's position and mouse position
//           const dx = mousePosition.x - (rocketPosition.left + rocketPosition.width / 2);
//           const dy = mousePosition.y - (rocketPosition.top + rocketPosition.height / 2);

//           // Define a "speed" for how fast/far the rocket should move
//           const speed = .5;  // This can be adjusted

//           // Normalize the difference to get the direction
//           // const distance = Math.sqrt(dx * dx + dy * dy);
//           // const directionX = dx / distance;
//           // const directionY = dy / distance;

//           newTop += dy * speed;
//           newLeft += dx * speed;
//           break;
//       default:
//         break;
//     }

//     for (const divRef of borderedDivRefs) {
//       if (wouldIntersect(newTop, newLeft, divRef.current)) {
//         return;
//       }
//     }

//     setTop(newTop);
//     setLeft(newLeft);

//     if (movementTimeout) {
//       clearTimeout(movementTimeout);
//   }
//     const timeout = setTimeout(() => {
//       setIsMoving(false);
//     }, 150)

//     setMovementTimeout(timeout);
//   };

//   useEffect(() => {
//     const updateMousePosition = (e) => {
//         setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener('mousemove', updateMousePosition);

//     return () => window.removeEventListener('mousemove', updateMousePosition);
// }, []);

// const computeRotation = () => {

//   if (!movableRef.current) {
//     return 0;  // return a default value if ref isn't set
// }

//   const rocketPosition = movableRef.current.getBoundingClientRect();
//   const rocketCenter = {
//       x: rocketPosition.left + rocketPosition.width / 2,
//       y: rocketPosition.top + rocketPosition.height / 2,
//   };

//   const dx = mousePosition.x - rocketCenter.x;
//   const dy = mousePosition.y - rocketCenter.y;

//   const angle = Math.atan2(dy, dx) * (180 / Math.PI);

//   return angle + 53;  // +90 to adjust since the rocket's default is up
// };



//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [top, left]);

//   return (
//     <div className="w-full min-h-screen flex relative">
//       <div
//         ref={movableRef}
//         className="z-50 movable-rocket"
//         style={{
//           position: "absolute",
//           top: `${top}px`,
//           left: `${left}px`,
//           transform: `rotate(${computeRotation()}deg)`
//         }}
//       >
//         <span 
//         className="text-2xl"
//           style={{ 
//             animation: isMoving ? 'pulsate 1.5s infinite' : 'none', 
//             display: 'inline-block'
//           }}>
//           🚀
//         </span>
//       </div>
//       <div className="w-1/2 min-h-screen flex flex-col items-center">
//         <div ref={borderedDivRefs[0]} className="border border-black h-10 w-3/4"></div>
//       </div>
//       <div className="w-1/2 min-h-screen flex flex-col items-center justify-center space-y-24">
//         <div ref={borderedDivRefs[1]} className="  w-3/4">Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World </div>
//         <div ref={borderedDivRefs[2]} className="border border-black h-48 w-3/4"></div>
//       </div>
//     </div>
//   );
// }
