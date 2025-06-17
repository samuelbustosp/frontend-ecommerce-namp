import { FaShoppingBasket } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { Link } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Combo = ({name, price, img, stock, hasStock, productList}) => {
    return (
        <article className="flex flex-col shadow-lg bg-white p-2 mb-2 border border-gray-300 w-full h-76 rounded-lg">
            <div className="">
                <img
                    src={`${img}`}
                    alt={name}
                    className="w-full h-48 object-contain rounded-t-xl"
                />
            </div>
            <div className="flex-grow">
                <header className="p-2">
                    <h2 className="text-md poppins-semibold">{name}</h2>
                    <span className="font-light text-xs overflow-hidden text-ellipsis whitespace-nowrap block max-h-12">{productList}</span>
                    <div className="min-h-[2px]">
                        {price > 30000 ? ( 
                            <p className="text-sm text-green-800 flex items-center font-semibold gap-1">
                                <MdLocalShipping/>
                                Envío gratis
                            </p>
                        ) : (
                            <p>&nbsp;</p>
                        )}
                    </div>
                </header>
                <section className="p-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xl poppins-bold text-blue-950 dark:text-white">${price}</span>
                        {hasStock ? (
                            <Link
                                to={`/combo/${name.toLowerCase()}`}
                                className="text-white bg-customColorHover hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-3 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <FaShoppingBasket />
                            </Link>
                        ) : (
                            <div className="text-gray-500 border border-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center cursor-not-allowed">
                                Sin stock
                            </div>
                        )}
                    </div>
                </section>
                <footer></footer>
            </div>
        </article>
    );
};

export default Combo;
