import Combo from "./Combo";

const ComboList = ({combos}) => {
    return ( 
        <div className="grid grid-cols-4 gap-5 w-full mt-8">
            {combos.map((combo)=>(
                <Combo {...combo}/>
            ))}
        </div>
     );
}
 
export default ComboList;

