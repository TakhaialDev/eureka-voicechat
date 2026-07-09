import Image from "next/image";

const ToyotaLogo = () => {
    return (
        <div className="brand-logo-call flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-[18%] w-full transition-all duration-700 ease-in-out">
            <div className="w-44 h-44 sm:w-52 sm:h-52 aspect-square rounded-full overflow-hidden bg-black shadow-2xl ring-4 ring-primary-a1/30">
                <Image
                    priority
                    loading="eager"
                    src="/logo.png"
                    alt="Eureka Kuwait"
                    width={720}
                    height={720}
                    className="w-full h-full aspect-square object-cover object-center"
                />
            </div>
        </div>
    );
};

export default ToyotaLogo;
