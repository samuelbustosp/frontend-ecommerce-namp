import { Spinner } from "flowbite-react";
import useFetchComboById from "../../../hooks/combo/useFetchComboById";
import ComboDetailList from "../../../components/client/combo/ComboDetailList";

const ComboDetailContainer = () => {
    const { combo, error, loading } = useFetchComboById();

    if (loading) {
        return (
            <div className="bottom-1/2 flex justify-center items-center h-80">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!combo) {
        return <div>No se encontró el combo</div>;
    }

    return (
        <div className="">
            <ComboDetailList combo={combo} />
        </div>
    );
};

export default ComboDetailContainer;
