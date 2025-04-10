import { MdLocalShipping } from "react-icons/md";


const Combo = ({name, price, img}) => {
    return (
        <article className="flex flex-col shadow-lg bg-white p-2 mb-2 border border-gray-300 w-full h-76 rounded-lg">
            <div className="">
                <img
                    src={`http://localhost:8080${img}`}
                    alt={name}
                    className="w-full h-48 object-contain rounded-t-xl"
                />
            </div>
            <div className="flex-grow">
                <header className="p-2">
                    <h2 className="text-md poppins-semibold">{name}</h2>
                    <div className="min-h-[2px] ">
                        {price > 30000 ? ( 
                            <p className="text-sm text-green-800 flex items-center font-semibold gap-1">
                                <MdLocalShipping/>
                                Envío gratis
                            </p>
                        ):( 
                            <p>&nbsp;</p>
                        )}
                    </div>
                </header>
                <section className=" p-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xl poppins-bold text-blue-950 dark:text-white">${price}</span>
                    </div>
                </section>
                <footer></footer>
            </div>
        </article>
    );
};


export default Combo;
