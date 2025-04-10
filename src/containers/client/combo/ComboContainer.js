import ComboList from "../../../components/client/combo/ComboList";
import useFetchCombo from "../../../hooks/combo/useFetchCombo";
import { Spinner } from "flowbite-react";

const ComboContainer = () => {
    const {combos, loading, error} = useFetchCombo();

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        )
    }
    
    return ( 
        <div className="flex items-center justify-center container gray-100"> 
            <ComboList combos={combos}/>
        </div>
     );
}
 
export default ComboContainer;