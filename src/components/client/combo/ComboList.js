import { Link } from "react-router-dom";
import Combo from "./Combo";

const ComboList = ({combos}) => {
    return ( 
        <div className="grid grid-cols-4 gap-5 w-full mt-8">
            {combos.map((combo)=>(
                <Link to={`/combo/${combo.name.toLowerCase()}`} key={combo.idCombo} className="h-full flex justify-center">
                    <Combo {...combo}/>
                </Link>
                
            ))}
        </div>
     );
}
 
export default ComboList;

