import Breadcrumb from "../../components/client/Breadcrumb";
import ComboContainer from "../../containers/client/combo/ComboContainer";
import { Link } from "react-router-dom";
import useFetchCombo from "../../hooks/combo/useFetchCombo";

const ComboPage = () => {
    const {combos} = useFetchCombo()
    const totalCombos = combos.length

    const paths = [
        { name: "Inicio", to: '/home' },
        { name: "Combos", to: '/combo' },
    ];

    return (
        <div className="flex min-h-screen gap-2 mt-4">
            <div className="w-1/6 pl-8">
                <div className="w-full mb-4 ml-2">
                    <Breadcrumb paths={paths} />
                </div>
                <div className="mb-6 ml-2">
                    <h1 className="font-semibold poppins-bold text-2xl ">Combos</h1>
                    <p className="poppins-light text-sm">{totalCombos} resultados</p>
                </div>
                <ol className="bg-white py-4 px-2 rounded-xl border shadow-lg">
                    <h2 className="poppins-semibold text-blue-950 text-lg ml-2">Productos</h2>
                    {combos.map((combo)=>(        
                        <li className="leading-5 ml-2 poppins-regular">
                            {combo.name.charAt(0).toUpperCase() + combo.name.slice(1).toLowerCase()}
                        </li>
                    ))}
                    <p className="text-sm ml-2 poppins-semibold text-blue-950 mt-2">Ver todos</p>
                </ol>
            </div>

            <div className="w-4/5 items-center justify-center container">
                <ComboContainer />
            </div>
        </div>
    );
}

export default ComboPage;