import ComboDetail from "./ComboDetail";

const ComboDetailList = ({combo}) => {
    return ( 
        
        <div key={combo.idCombo} className="h-full flex justify-center">
            <ComboDetail {...combo} />
         </div>
            
     );
}

 
export default ComboDetailList;