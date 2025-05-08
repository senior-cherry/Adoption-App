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
    return (
        <section className="px-6 py-8 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((src, index) => (
                <Image
                    key={index}
                    src={src}
                    alt={`gallery image ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full rounded-lg"
                />
            ))}
        </section>
    );
}
