import { Link } from "react-router-dom";
import Product from "./Product";
import PropTypes from 'prop-types';

const ProductList = ({products}) => {
    return ( 
        <div className="grid grid-cols-4 gap-5 w-full mt-8">
            {products.map((prod) => (
                <Link to={`/producto/${prod.name.toLowerCase()}`} key={prod.idProduct} className="h-full flex justify-center">
                    <Product {...prod} />
                </Link>
            ))}
        </div>
     );
}

ProductList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
    ).isRequired
};
export default ProductList;