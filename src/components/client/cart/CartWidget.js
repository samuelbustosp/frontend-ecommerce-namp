import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../../contexts/CartContext';
import { useUser } from '../../../contexts/UserContext'; // Importa el contexto del usuario

function CartWidget() {
    const { cart } = useCartContext();
    const { user } = useUser(); // Obtiene el usuario del contexto

    var totalQuantity = 0;

    cart.map((i) => {
        return totalQuantity = totalQuantity + i.quantity;
    });

    return (
        <Link to='/cart' className="text-2xl" style={{ lineHeight: '1.1' }}>
            <FaShoppingCart />
            {user && ( // Muestra la cantidad solo si hay un usuario autenticado
                <span className="absolute -top-2 -right-3.5 bg-blue-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantity}
                </span>
            )}
        </Link>
    );
}

export default CartWidget;