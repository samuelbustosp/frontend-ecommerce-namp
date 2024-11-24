import ProductDetail from "./ProductDetail";
import PropTypes from 'prop-types';

const ProductDetailList = ({product}) => {
    console.log(product)
    return ( 
        
        <div key={product.idProduct} className="h-full flex justify-center">
            <ProductDetail {...product} />
         </div>
            
     );
}

ProductDetailList.propTypes = {
    product: PropTypes.shape({
        idProduct: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired,
        img: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        idSubcategory: PropTypes.shape({
            idCategory: PropTypes.shape({
                name: PropTypes.string.isRequired
            }).isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
}
 
export default ProductDetailList;