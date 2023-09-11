"use client"

import Image from "next/image";
import { useState } from 'react';

interface SliderProps {
  images: string[];
}

export const Slider = ({ images }: SliderProps) => {
  const [showedImg, setShowedImg] = useState(images[0]);

  const changeImage = (url: string): void => {
    if (url != showedImg) {
      setShowedImg(url);
    }
  }

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-2">
        {images.map((url, index) => (
          <Image
            src={url}
            width={70}
            height={70}
            alt="Other product image"
            placeholder="blur"
            blurDataURL={url}
            className={`border-[1px] border-gray-300 rounded-lg cursor-pointer ${url === showedImg ? 'scale-[1.05] shadow shadow-blue-light' : ''} transition-transform`}
            key={`${index}${Date.now()}`}
            onMouseEnter={() => changeImage(url)}
            onClick={() => changeImage(url)}
          />
        ))}
      </div>
      <Image
        src={showedImg}
        width={300}
        height={300}
        alt="Product image"
        placeholder="blur"
        blurDataURL={showedImg}
        className="border-[1px] border-gray-300 rounded-xl"
      />
    </div>
  )
}