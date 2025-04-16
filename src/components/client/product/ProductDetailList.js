import ProductDetail from "./ProductDetail";

const ProductDetailList = ({product}) => {
    
    return ( 
        
        <div key={product.idProduct} className="h-full flex justify-center">
            <ProductDetail {...product} />
         </div>
            
     );
}

 
export default ProductDetailList;