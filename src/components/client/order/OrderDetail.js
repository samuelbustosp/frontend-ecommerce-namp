const OrderDetail = ({ order }) => {
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
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                {/* Encabezado */}
                <h2 className="text-3xl font-bold text-center text-green-600">¡Gracias por tu compra!</h2>
                <p className="text-center text-gray-600">Tu pedido ha sido confirmado.</p>
                <hr className="my-4"/>

                {/* Información del pedido */}
                <div className="mb-4">
                    <p><strong>ID de Orden:</strong> {order.idOrder}</p>
                    <p><strong>Fecha:</strong> {formattedDate}</p>
                    <p><strong>Estado:</strong> <span className="text-green-700 font-semibold">{order.idState.name}</span></p>
                </div>

                {/* Productos comprados */}
                <h3 className="text-xl font-semibold mb-2">Productos comprados</h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                    {order.orderDetail.map((item) => (
                        <div key={item.idProduct.idProduct} className="flex justify-between items-center border-b py-2">
                            <div>
                                <p className="font-semibold">{item.idProduct.name}</p>
                                <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="text-gray-900 font-semibold">${item.subTotal.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold mt-4 p-2 border-t">
                    <p>Total:</p>
                    <p className="text-green-700">${totalOrder.toFixed(2)}</p>
                </div>

                {/* Botón para volver */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Seguir comprando
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
