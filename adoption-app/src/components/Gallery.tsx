'use client';

import { useEffect } from 'react';
import Image from 'next/image';

const images = [
    "/uploads/philip-veater-qOt9-QPYmSA-unsplash.jpg",
    "/uploads/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg",
    "/uploads/marcus-dietachmair-4JUscQ_9UrA-unsplash.jpg",
    "/uploads/jae-park-7GX5aICb5i4-unsplash.jpg",
    "/uploads/banner2.jpg",
    "/uploads/daniel-frank-VL2Vec7fHLU-unsplash.jpg",
    "/uploads/mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg",
    "/uploads/erin-testone-QCyVCPeScnk-unsplash.jpg",
    "/uploads/fatty-corgi-Zn5chZcnFRA-unsplash.jpg",
    "/uploads/sergey-semin-vMNr5gbeeTk-unsplash.jpg",
    "/uploads/pexels-andreas-l-2004808-3626111.jpg",
    "/uploads/pexels-pixabay-62289.jpg",
    "/uploads/pexels-pinamon-31422622.jpg",
    "/uploads/pexels-pixabay-104827.jpg",
    "/uploads/pexels-valeriya-1805164.jpg",
    "/uploads/pexels-cottonbro-4921291.jpg",
    "/uploads/pexels-pinamon-31518652.jpg",
];

export default function Gallery() {
    const revealImage = (img: HTMLElement) => {
        const rect = img.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh) {
            img.classList.add('opacity-100', 'translate-y-0');
            img.classList.remove('opacity-0', 'translate-y-5');
        }
    };

    useEffect(() => {
        const imgs = document.querySelectorAll('.gallery-img') as NodeListOf<HTMLElement>;

        const handleScroll = () => {
            imgs.forEach(revealImage);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        revealImage(img);
    };

    return (
        <section className="px-6 py-8 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((src, index) => (
                <Image
                    key={index}
                    src={src}
                    alt={`gallery image ${index + 1}`}
                    width={400}
                    height={300}
                    onLoad={handleImageLoad}
                    className="gallery-img w-full rounded-lg opacity-0 translate-y-5 transition-all duration-700 ease-out hover:opacity-90"
                />
            ))}
        </section>
    );
}
