import Banner from "../../components/client/Banner";
import ProductContainer from "../../containers/client/product/ProductContainer";
import ComboContainer from "../../containers/client/combo/ComboContainer"
import PromotionalCards from "../../components/client/PromotionalCards";
import bannerImg from "../../components/client/assets/banner-wine-prod.jpg";
import CategoryCarousel from "../../components/client/category/CategoryCarrousel";

const Home = () => {

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container">
                <PromotionalCards />
                <Banner />
                <CategoryCarousel/>
            </div>
            <div className="relative">
                <div
                    className="relative h-banner bg-cover bg-center mb-4 overflow-hidden transition-all duration-300 cursor-default"
                    style={{
                        backgroundImage: `url(${bannerImg})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-100 opacity-100"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center p-4">
                        <div className="pl-10">
                            <h2 className="text-white text-3xl md:text-5xl poppins-bold">Nuestros Productos</h2>
                            <p className="text-white text-lg poppins-light">Brindamos un servicio especial.</p>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="relative transition-opacity duration-700 mb-20"
                style={{
                    marginTop: "-150px", 
                    zIndex: 10,
                }}
            >
                <ProductContainer />
                <div className="mt-6 min-h-screen">
                    <h3 className="poppins-bold text-3xl pl-16">Combos</h3>
                    <ComboContainer />  
                </div>
                
            </div>
        </div>
    );
};

export default Home;
