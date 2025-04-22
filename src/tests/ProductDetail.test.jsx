// ProductDetail.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetail from '../components/client/product/ProductDetail';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '@testing-library/jest-dom';


const mockAddItem = jest.fn();

const mockProduct = {
  idProduct: 1,
  name: 'Cerveza Artesanal',
  description: 'Una cerveza artesanal bien fresquita.',
  stock: 10,
  img: '/img/cerveza.png',
  price: 35000,
  sellingPrice: 32000,
  idSubcategory: {
    name: 'cervezas',
    idCategory: {
      name: 'bebidas'
    }
  }
};

const renderWithContext = (ui) => {
  return render(
    <CartContext.Provider value={{ addItem: mockAddItem }}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </CartContext.Provider>
  );
};

describe('ProductDetail', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
  });

  test('renderiza correctamente el nombre, descripción y precio con promoción', () => {
    renderWithContext(<ProductDetail {...mockProduct} />);

    expect(screen.getByText('Cerveza Artesanal')).toBeInTheDocument();
    expect(screen.getByText(/Una cerveza artesanal bien fresquita/i)).toBeInTheDocument();
    expect(screen.getByText('$35000')).toBeInTheDocument(); // Precio original tachado
    expect(screen.getByText('$32000')).toBeInTheDocument(); // Precio promocional
    expect(screen.getByText(/Envío gratis/i)).toBeInTheDocument();
  });

  test('muestra "Stock disponible" si hay stock', () => {
    renderWithContext(<ProductDetail {...mockProduct} />);
    expect(screen.getByText(/Stock disponible/i)).toBeInTheDocument();
  });

  test('muestra "Sin stock" si no hay stock', () => {
    const productSinStock = { ...mockProduct, stock: 0 };
    renderWithContext(<ProductDetail {...productSinStock} />);
    expect(screen.getByText(/Sin stock/i)).toBeInTheDocument();
  });

  test('agrega producto al carrito al hacer click en "Agregar al carrito"', () => {
    renderWithContext(<ProductDetail {...mockProduct} />);
    const btnAgregar = screen.getByRole('button', { name: /Agregar al carrito/i });
    fireEvent.click(btnAgregar);
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockProduct.idProduct,
        name: mockProduct.name,
        price: mockProduct.price,
        img: mockProduct.img,
        type: 'product',
      }),
      1 // cantidad inicial
    );
  });
});
