import HeroImage from "../assets/hero.png"

const Hero = () => {
    return (
        <div>
            <img
                src={HeroImage}
                alt="Hero Image"
                className="w-full max-h-[65vh] object-cover" />
        </div>
    );
}

export default Hero;