import { Spinner } from "flowbite-react";
import useFetchSubcategoryById from "../../../hooks/subcategory/useFetchSubcategoryById";
import SubcategoryDetailList from "../../../components/client/subcategory/SubcategoryDetailList";
import useFetchProductBySubcategory from "../../../hooks/product/useFetchProductsBySub";

const SubcategoryDetailContainer = () => {
    const { subcategory, loading } = useFetchSubcategoryById();
    const { products } = useFetchProductBySubcategory(subcategory?.name);
    console.log(subcategory.name)
    console.log(products)

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <SubcategoryDetailList products={products} subcategory={subcategory}/>
        </div>
    );
}
 
export default SubcategoryDetailContainer;