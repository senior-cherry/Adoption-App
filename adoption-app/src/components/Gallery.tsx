import Image from 'next/image';

const images = [
    "/philip-veater-qOt9-QPYmSA-unsplash.jpg",
    "/ricky-kharawala-adK3Vu70DEQ-unsplash.jpg",
    "/marcus-dietachmair-4JUscQ_9UrA-unsplash.jpg",
    "/jae-park-7GX5aICb5i4-unsplash.jpg",
    "/banner2.jpg",
    "/daniel-frank-VL2Vec7fHLU-unsplash.jpg",
    "/mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg",
    "/erin-testone-QCyVCPeScnk-unsplash.jpg",
    "/fatty-corgi-Zn5chZcnFRA-unsplash.jpg",
    "/sergey-semin-vMNr5gbeeTk-unsplash.jpg",
    "/pexels-andreas-l-2004808-3626111.jpg",
    "/pexels-pixabay-62289.jpg",
    "/pexels-pinamon-31422622.jpg",
    "/pexels-pixabay-104827.jpg",
    "/pexels-valeriya-1805164.jpg",
    "/pexels-cottonbro-4921291.jpg",
    "/pexels-pinamon-31518652.jpg",
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
