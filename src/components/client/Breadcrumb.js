import { GrFormNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const Breadcrumb = ({ paths }) => {
    return (
        <nav className="flex items-center mx-0.5 poppins-light text-sm mb-2">
            {paths.map((path, index) => (
                <Link to={path.to} key={index} className="flex items-center whitespace-nowrap">
                    <span className="hover:text-blue-800">{path.name}</span>
                    {index < paths.length - 1 && (
                        <span className="mx-0 flex items-center">
                            <GrFormNext />
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
};

// PropTypes para validar los props
Breadcrumb.propTypes = {
    paths: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,  // 'name' debe ser una cadena de texto
            to: PropTypes.string.isRequired     // 'to' debe ser una cadena de texto (URL)
        })
    ).isRequired  // 'paths' debe ser un array de objetos con las propiedades 'name' y 'to'
};

export default Breadcrumb;
