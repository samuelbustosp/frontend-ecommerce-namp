import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const CategoryMenuList = ({categories}) => {

    return ( 
        <div className="category-menu-bg rounded-b-xl poppins-semibold flex items-center gap-10 p-2 justify-center">
            {categories.map((cat) => (
                <div key={cat.idCategory} className=" flex items-center text-white">
                    <Link to={`/categoria/${cat.name.toLowerCase()}`}> {cat.name} </Link>
                </div>
            ))}
        </div>
     );
}

CategoryMenuList.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            idCategory: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired
};
 
export default CategoryMenuList;