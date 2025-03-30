import { FaShoppingCart } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { useCartContext } from '../../../contexts/CartContext';


function CartWidget() {
    const {cart, setCart} = useCartContext()

    var totalQuantity = 0

    cart.map((i)=>{
        return totalQuantity = totalQuantity + i.quantity
    })

    return (
        <Link to='/cart' className="text-2xl" style={{ lineHeight: '1.1' }} 
        >
            <FaShoppingCart />
            <span className="absolute -top-2 -right-3.5 bg-blue-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalQuantity}
            </span>
        </Link>
    )
}

export default CartWidget