import { useMemo } from "react";
import CategoryMenuList from "../../../components/client/category/CategoryMenuList";
import { Spinner } from "flowbite-react";
import useFetchCategory from "../../../hooks/category/useFetchCategory";
import PropTypes from 'prop-types';

const CategoryMenu = ({isMenuOpen}) => {
    const { categories, loading } = useFetchCategory();
    

    const sortedCategories = useMemo(() => 
        categories
            .sort((a, b) => a.name.localeCompare(b.name)) 
    , [categories]);

    if (!isMenuOpen) return null;

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        )
    }

    return (  
        <div>
            <CategoryMenuList categories={sortedCategories}/>
        </div>
    );
}

// Validación de props para el componente CategoryMenu
CategoryMenu.propTypes = {
    isMenuOpen: PropTypes.bool.isRequired,  // 'isMenuOpen' debe ser un booleano requerido
};

export default CategoryMenu;