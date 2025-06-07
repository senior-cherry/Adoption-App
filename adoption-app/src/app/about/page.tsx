import {Image} from "@chakra-ui/react";
import {getLocale, getTranslations} from "next-intl/server";

const About = async () => {
    const locale = await getLocale();
    const t = await getTranslations("aboutUs");
    return (
        <div id="about" className="container">
            <div className="about-row">
                <div className="left-col">
                    <Image src="/philip-veater-jyASQAXhmGk-unsplash.jpg" alt="image 1" />
                </div>
                <div className="right-col">
                    {locale === 'uk' ? (
                        <h1>Наша <span>історія</span></h1>
                    ) : (
                        <h1>Our <span>story</span></h1>
                    )}
                    <p>{t("paragraph1")}</p>
                </div>
            </div>

            <div className="about-row">
                <div className="left-col">
                    {locale === 'uk' ? (
                        <h1>Реалізація <span>мрії</span></h1>
                    ) : (
                        <h1>Making the <span>dream</span> real</h1>
                    )}
                    <p>{t("paragraph2")}</p>
                </div>
                <div className="right-col">
                    <Image src="/tran-mau-tri-tam-7QjU_u2vGDs-unsplash.jpg" alt="image 2" />
                </div>
            </div>

            <div className="about-row">
                <div className="left-col">
                    <Image src="/jametlene-reskp-fliwkBbS7oM-unsplash.jpg" alt="image 3" />
                </div>
                <div className="right-col">
                    {locale === 'uk' ? (
                        <h1>Перші <span>кроки</span></h1>
                    ) : (
                        <h1>Our first <span>steps</span></h1>
                    )}
                    <p>{t("paragraph3")}</p>
                </div>
            </div>
        </div>
    );
}

export default About;