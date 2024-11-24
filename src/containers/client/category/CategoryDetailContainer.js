import { Spinner } from "flowbite-react";
import SubcategoryDetail from "../../../components/client/subcategory/SubcategoryDetail";
import useFetchCategoryById from "../../../hooks/category/useFetchCateogryById";


const CategoryDetailContainer = () => {
    const { category, subcategories, loading } = useFetchCategoryById();

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        )
    }
    
    return (  
        <div className="">
            <SubcategoryDetail subcategories={subcategories} category={category}/>
        </div>
    );
}
 
export default CategoryDetailContainer;