import "./About.css";
import printer from '../../Components/img/3dprinter.jpg'
import material from '../../Components/img/material.png'
import delivery from '../../Components/img/delivery.jpg';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                Viridian Workshop is a 3D printing company commited to bringing your ideas to life.
                We offer different high-quality 3D products and even 3D printing services.
            </div>
            <div className="about-one about-sections">
                <p className="about-paragraph">
                    At Viridian Workshop, Our team stays up to date with the latest technology,
                    consistently investing in the best equipment to ensure efficient and precise 3D prints.
                    We prioritize fabricating the highest quality products in the most effective way possible.
                </p>
                <div className="about-image"> <img src={printer} alt="homepage" /></div>
            </div>

            <div className="about-two about-sections">
                <div className="about-image"> <img src={material} alt="homepage" /></div>
                <p className="about-paragraph">
                    Our company prioritises the highest quality materials for 3D printing,
                    offering a wide array of options
                    to meet any project's needs.
                    From durable to flexible materials,
                    we ensure that every prints are up your standards and likings.
                </p>
            </div>
            <div className="about-three  about-sections">
                <p className="about-paragraph">
                    Our reliable delivery service garantees the safety of your 3D products.
                    We ensure that your order always arrive on time without even a second of delay.
                    Your prints will always be carefully packaged and deliver in perfect form.
                </p>
                <div className="about-image"> <img src={delivery} alt="homepage" /></div>
            </div>
        </div>
    );
}

export default About;