import { TbShoppingBagSearch } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const OrderDetail = ({ order }) => {
    console.log("order",order)
    
    if (!order) return <p>Cargando...</p>;

    // Calcular total sumando los subtotales de cada producto
    const totalOrder = order.orderDetail.reduce((acc, item) => acc + item.subTotal, 0);
    const formattedDate = new Date(order.dateTime).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center my-10">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                
                <h2 className="text-3xl poppins-bold text-center text-green-600">¡Gracias por tu compra!</h2>
                <p className="text-center poppins-regular text-gray-600">Tu pedido ha sido confirmado.</p>
                <hr className="my-4"/>

                {/* Información del pedido */}
                <div className="mb-4 poppins-semibold text-gray-800">
                    <p className="">ID de Orden: {order.idOrder}</p>
                    <p>Fecha: {formattedDate}</p>
                    <p>Estado: <span className="bg-yellow-400 rounded-full text-xs px-2 p-0.5 poppins-semibold text-white ">{order.idState.name}</span></p>
                </div>

                <h3 className="text-xl poppins-semibold text-black/90 mb-2">Productos comprados</h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                {order.orderDetail.map((item, index) => {
                    const isProduct = !!item.idProduct;
                    const data = isProduct ? item.idProduct : item.idCombo;

                    return (
                        <div key={index} className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <img 
                                    src={`http://localhost:8080${data.img}`} 
                                    alt={data.name} 
                                    className="w-16 h-16 rounded-lg object-cover shadow-xl mr-4" 
                                />
                                <div>
                                    <p className="poppins-semibold">{data.name}</p>
                                    <p className="text-gray-600 poppins-light text-sm">Cantidad: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="text-gray-900 poppins-bold text-lg">${item.subTotal}</p>
                        </div>
                    );
                })}

                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-xl poppins-bold mt-4 p-2 border-t">
                    <p>Total:</p>
                    <p className="text-green-800">${totalOrder.toFixed(2)}</p>
                </div>

                {/* Botón para volver */}
                <div className="flex justify-center mt-6">
                    <Link to="/">
                        <button className=" p-2 rounded-lg bg-blue-800 poppins-regular text-sm text-white flex items-center gap-1">
                        <span className="text-xl"><TbShoppingBagSearch/></span> Seguir comprando
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
