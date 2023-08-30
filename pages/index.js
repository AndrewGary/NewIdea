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
      default:
        break;
    }

    for (const divRef of borderedDivRefs) {
      if (wouldIntersect(newTop, newLeft, divRef.current)) {
        return;
      }
    }

    setTop(newTop);
    setLeft(newLeft);

    if (movementTimeout) {
      clearTimeout(movementTimeout);
  }
    const timeout = setTimeout(() => {
      setIsMoving(false);
    }, 150)

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
        className="z-50"
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
        <div ref={borderedDivRefs[1]} className="  w-3/4">Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World </div>
        <div ref={borderedDivRefs[2]} className="border border-black h-48 w-3/4"></div>
      </div>
    </div>
  );
}
