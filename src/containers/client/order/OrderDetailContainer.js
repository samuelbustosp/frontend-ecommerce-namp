import { useParams } from "react-router-dom";
import useFetchOrderById from "../../../hooks/order/useFetchOrderById";
import OrderDetail from "../../../components/client/order/OrderDetail";

const OrderDetailContainer = () => {
    const { id } = useParams();
    const {order, loading, error} = useFetchOrderById(id);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return ( 
        <div>
            <OrderDetail order={order} />
        </div>
     );
}
 
export default OrderDetailContainer;