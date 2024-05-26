import {Image} from "@chakra-ui/react";

const About = () => {
    return (
        <main className="about bg-gray-100 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="image-container">
                         <Image src="/uploads/krista-mangulsone-9gz3wfHr65U-unsplash.jpg" alt="Image 1" className="rounded-lg shadow-md" />
                    </div>
                    <div className="text-container">
                        <p className="text-xl leading-relaxed mb-8">
                            (Company Description Here)
                        </p>
                        <p className="text-gray-700 mb-4">
                            (Additional details about your company or mission)
                        </p>
                        <a href="#"
                           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">Learn
                            More</a>
                    </div>
                </div>
        </main>
    );
}

export default About;