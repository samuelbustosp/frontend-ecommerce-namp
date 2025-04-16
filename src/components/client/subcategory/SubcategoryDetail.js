import ProductList from "../product/ProductList";
import Breadcrumb from "../Breadcrumb"
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const SubcategoryDetail = ({ subcategories , category}) => {
    const allProducts = subcategories.flatMap(subcategory => subcategory.products);
    const totalProducts = allProducts.length
    
    const paths = [
        { name: "Inicio", to:'/home' },
        { name: category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase() }, `/category/${category.name.toLowerCase()}`
    ];

    return (
        <div className="flex min-h-screen gap-2 mt-4">
            <div className="w-1/6 pl-8">
                <div className="w-full mb-4 ml-2"> 
                    <Breadcrumb paths={paths} />
                </div>
                <div className="mb-6 ml-2">
                    <h1 className="font-semibold poppins-bold text-2xl ">{category.name}</h1>
                    <p className="poppins-light text-sm">{totalProducts} resultados</p>
                </div>  
                <ol className="bg-white py-4 px-2 rounded-xl border shadow-lg ">
                    <h2 className="poppins-semibold text-blue-950 text-lg ml-2">Categorías</h2>
                    {subcategories.map((subcategory) => (
                        <li key={subcategory.idSubcategory} className="leading-5 ml-2 flex items-center poppins-regular">
                            <Link to={`subcategoria/${subcategory.name.toLowerCase()}`} className="flex items-center">
                                {subcategory.name.charAt(0).toUpperCase() 
                                + subcategory.name.slice(1).toLowerCase()} 
                                <p className="poppins-light text-gray-900 text-sm">({subcategory.products.length})</p>    
                            </Link>
                        </li>
                    ))}
                    <h3 className="poppins-semibold text-blue-950 text-lg ml-2 mt-4">Combos</h3>
                    <li className="poppins-regular ml-2 leading-5">
                        <Link to='/combo'>Ver todos</Link>
                    </li>
                </ol>
                
            </div>
            
            <div className="w-4/5 items-center justify-center container">
                <ProductList products={allProducts} />
            </div>
        </div>
    );  
};


SubcategoryDetail.propTypes = {
    subcategories: PropTypes.arrayOf(
        PropTypes.shape({
            idSubcategory: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
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
        })
    ).isRequired,
    category: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired
};

export default SubcategoryDetail;
