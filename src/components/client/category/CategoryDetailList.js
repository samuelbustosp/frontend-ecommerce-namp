import SubcategoryDetail from "../subcategory/SubcategoryDetail";
import PropTypes from 'prop-types';

const CategoryDetailList = ({subcategories}) => {
    return ( 
        <div className="">
            <SubcategoryDetail subcategories={subcategories}/>
        </div>
     );
}

CategoryDetailList.propTypes = {
    subcategories: PropTypes.array.isRequired
};

export default CategoryDetailList;