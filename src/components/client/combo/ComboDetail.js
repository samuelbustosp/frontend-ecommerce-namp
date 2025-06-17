import { Link } from "react-router-dom";
import { TbShoppingBagPlus, TbShoppingBagSearch  } from "react-icons/tb";

import Breadcrumb from "../Breadcrumb";
import { MdLocalShipping } from "react-icons/md";
import PropTypes from 'prop-types';
import { useCartContext } from "../../../contexts/CartContext";
import { useState } from "react";
import ProductCount from "../product/ProductCount";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ComboDetail = ({idCombo,name,description,hasStock,productList,img,price,availableStock }) => {
    const paths = [
        { name: "Inicio", to: '/home' },
        {name: "Combos", to: '/combo'},
        {name: name},
    ];

    const { addItem } = useCartContext();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (quantity > 0 && quantity <= availableStock) {
            addItem({ id: idCombo, name, price, img, type: "combo" }, quantity);
        }
    };

    return ( 
        <div className="bg-white container rounded-xl shadow-lg">
            <div className="m-2 flex items-center justify-between">
                <Breadcrumb paths={paths} />
            </div>
            <div className="flex justify-between my-8 items-center">
                
                <div className="w-2/5 justify-center flex ml-auto mr-auto transition-transform duration-300 ease-in-out transform hover:scale-110">
                    <img
                        src={`${img}`}
                        alt={name}
                        className="w-full h-auto object-contain rounded-t-xl"
                    />
                </div>
                <div className="border rounded-2xl w-1/3 text-left py-4 shadow-lg mr-6">
                    <h1 className="poppins-bold text-2xl ml-4 text-gray-800">{name}</h1>
                    <p className="poppins-light text-md ml-4">{description}</p>
                    <div className="min-h-[2px] ml-4 mb-12 ">
                        {price > 30000 ? ( 
                            <p className="text-sm text-green-800 flex items-center font-semibold gap-1">
                                <MdLocalShipping/>
                                Envío gratis
                            </p>
                        ):( 
                            <p>&nbsp;</p>
                        )}
                    </div>
                    <h1 className="poppins-semibold text-4xl ml-4 mb-8 text-blue-900">${price}
                        <span className="ml-1 text-xl ">ARS</span>
                    </h1>
                    {availableStock > 0 ? 
                        (
                            <p className="poppins-light ml-4 mb-4">Stock disponible</p>
                        ):(
                            <p className="poppins-light ml-4">Sin stock</p>
                        )
                    }
                    <div className="flex items-center ml-4 mb-8">
                        <p className="poppins-light text-sm">Cantidad:</p>
                            <ProductCount stock={availableStock} quantity={quantity} setQuantity={setQuantity}/>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <button 
                            className="ml-4 p-2 rounded-full bg-blue-800 poppins-semibold text-sm text-white flex items-center gap-1"
                            onClick={handleAddToCart}
                        >
                            <span className="text-xl"><TbShoppingBagPlus/></span> Agregar al carrito
                        </button>
                        <button className="mr-4 p-2 rounded-lg bg-blue-100 poppins-semibold text-sm text-blue-800 flex items-center gap-1">
                        <span className="text-xl"><TbShoppingBagSearch/></span> Seguir comprando
                        </button>
                    </div>
                </div>
                
            </div>
            
        </div> 
    );
}


 
export default ComboDetail;