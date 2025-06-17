import { Spinner } from "flowbite-react";
import ProductList from "../../../components/client/product/ProductList"
import useFetchProduct from "../../../hooks/product/useFetchProduct";

const ClientProductContainer = () => {
    const { products, loading } = useFetchProduct();
    
    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        )
    }
    
    console.log('products todos', products)
    return ( 
        
        <div className="flex items-center justify-center container gray-100"> 
            <ProductList products={products} />
        </div>
       
     );
}
export default ClientProductContainer;