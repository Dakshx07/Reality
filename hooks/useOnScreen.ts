
import { useState, useEffect, RefObject } from 'react';

function useOnScreen(ref: RefObject<HTMLElement>, rootMargin = '0px', threshold = 0.1): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          // Unobserve after it has been seen once
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if(currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, rootMargin, threshold]);

  return isIntersecting;
}

export default useOnScreen;