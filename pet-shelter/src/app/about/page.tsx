import {Image} from "@chakra-ui/react";

const About = () => {
    return (
        <div id="about" className="container">
            <div className="about-row">
                <div className="left-col">
                    <Image src="/uploads/philip-veater-jyASQAXhmGk-unsplash.jpg" alt="image 1" />
                </div>
                <div className="right-col">
                    <h1>Наша <span>історія</span></h1>
                    <p>Ласкаво просимо до магазину Serenity Books, де кожна сторінка наповнена чарами та пригодами!
                        Наша історія почалася з великої любові до літератури та бажання дарувати читачам радість та
                        незабутні емоції.
                        З моменту нашого заснування, ми віддані меті подарувати світ казки та навчання через захоплюючі
                        книги.</p>
                </div>
            </div>

            <div className="about-row">
                <div className="left-col">
                    <h1>Реалізація <span>мрії</span></h1>
                    <p>Наш інтернет-магазин - це втілення мрії про те, щоб кожна людина мала доступ до чудових історій
                        та навчальних матеріалів.
                        Ми віримо в силу слова та вплив читання на розвиток уяви, творчості та важливих навичок.
                        Тут кожен зможе знайти книжку, яка відкриє новий світ для кожного читача.</p>
                </div>
                <div className="right-col">
                    <Image src="/uploads/tran-mau-tri-tam-7QjU_u2vGDs-unsplash.jpg" alt="image 2" />
                </div>
            </div>

            <div className="about-row">
                <div className="left-col">
                    <Image src="/uploads/jametlene-reskp-fliwkBbS7oM-unsplash.jpg" alt="image 3" />
                </div>
                <div className="right-col">
                    <h1>Перші <span>кроки</span></h1>
                    <p>Наші перші кроки були невеликими, але наповненими ентузіазмом та любов'ю до книг.
                        З моменту відкриття магазину, ми працюємо над тим, щоб кожен відвідувач знайшов у нас не лише
                        книгу, але й особливий момент для себе.
                        Ми вдячні за підтримку наших клієнтів та обіцяємо продовжувати творити чарівництво кожен
                        день.</p>
                </div>
            </div>
        </div>
    );
}

export default About;