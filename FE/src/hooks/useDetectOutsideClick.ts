import { useEffect, useRef, useState, RefObject, MutableRefObject } from "react";

export const useDetectOutsideClick = (
  handleOutsideClick: (e: Event, ref: RefObject<HTMLTextAreaElement | null>) => void = () => { }
) => {

  const ref = useRef<HTMLTextAreaElement | null>(null);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClicked(true);
      handleOutsideClick(event, ref);
    } else {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    document.addEventListener("mousedown", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, []);

  return { ref, isClicked, setIsClicked };
};


export const useDetectOutsideClickMenu = (
  handleOutsideClick: (e: Event, ref: MutableRefObject<HTMLDivElement | null>) => void = () => { }
) => {

  const ref = useRef<HTMLDivElement | null>(null);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClicked(true);
      handleOutsideClick(event, ref);
    } else {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    document.addEventListener("mousedown", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, []);

  return { ref, isClicked, setIsClicked };
};


export const useDetectOutsideClickLayout = (
  handleOutsideClick: (e: Event, ref: MutableRefObject<HTMLUListElement | null>) => void = () => { }
) => {

  const ref = useRef<HTMLUListElement | null>(null);

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClicked(true);
      handleOutsideClick(event, ref);
    } else {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    document.addEventListener("mousedown", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, []);

  return { ref, isClicked, setIsClicked };
};