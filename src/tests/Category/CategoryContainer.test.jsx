import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryContainer from '../../containers/admin/category/CategoryContainer';
import { useUser } from '../../contexts/UserContext';
import { act } from 'react';

// Mock the entire UserContext
jest.mock('../../contexts/UserContext', () => ({
  useUser: jest.fn()
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock the child components
jest.mock('../../components/admin/category/CategoryList', () => {
  return function MockCategoryList({ categories, deleteCategory, onEditCategory }) {
    return (
      <div data-testid="category-list">
        {categories.map(category => (
          <div key={category.idCategory} data-testid={`category-${category.idCategory}`}>
            {category.name}
            <button onClick={() => deleteCategory(category.idCategory)} data-testid={`delete-${category.idCategory}`}>
              Delete
            </button>
            <button onClick={() => onEditCategory(category)} data-testid={`edit-${category.idCategory}`}>
              Edit
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/admin/category/AddCategoryModal', () => {
  return function MockAddCategoryModal({ isOpen, onClose, onAddCategory, onUpdateCategory, categoryToEdit }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid="add-category-modal">
        <input 
          data-testid="name-input" 
          defaultValue={categoryToEdit ? categoryToEdit.name : ''} 
        />
        <input 
          data-testid="description-input" 
          defaultValue={categoryToEdit ? categoryToEdit.description : ''} 
        />
        <button 
          onClick={() => onAddCategory({ name: 'New Category', description: 'New Description' })}
          data-testid="add-button"
        >
          Add
        </button>
        <button 
          onClick={() => onUpdateCategory(categoryToEdit?.idCategory, { name: 'Updated Category', description: 'Updated Description' })}
          data-testid="update-button"
        >
          Update
        </button>
        <button onClick={onClose} data-testid="close-button">Close</button>
      </div>
    );
  };
});

jest.mock('../../components/admin/ErrorModal', () => {
  return function MockErrorModal({ isErrorModalOpen, closeErrorModal, error }) {
    if (!isErrorModalOpen) return null;
    return (
      <div data-testid="error-modal">
        {error}
        <button onClick={closeErrorModal} data-testid="close-error-button">Close</button>
      </div>
    );
  };
});

describe('CategoryContainer', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ token: 'fake-token' });
    jest.clearAllMocks();
  });

  test('debe cargar y mostrar categorías correctamente', async () => {
    const mockCategories = [
      { idCategory: 1, name: 'Category 1', description: 'Description 1' },
      { idCategory: 2, name: 'Category 2', description: 'Description 2' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories
    });

    await act(async () => {
      render(<CategoryContainer />);
    });

    // Esperar a que la carga termine
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api-namp/category');
    });
    
    // Esperar a que el spinner de carga desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('debe agregar una nueva categoría correctamente', async () => {
    const mockCategories = [];
    
    // Mock fetch para la carga inicial
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories
    });

    // Mock fetch para agregar una categoría
    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    // Mock fetch para recargar categorías después de agregar
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ idCategory: 1, name: 'New Category', description: 'New Description' }]
    });

    await act(async () => {
      render(<CategoryContainer />);
    });

    // Esperar a que la carga termine y el spinner desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Buscar el botón de agregar con un selector más flexible
    const addButton = await screen.findByRole('button', { name: /agregar|añadir|nueva|add/i });
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Buscar y hacer clic en el botón de añadir en el modal
    await waitFor(() => {
      expect(screen.getByTestId('add-button')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-button'));
    });

    // Verificar que se hizo la llamada API correcta
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api-namp/admin/category',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: JSON.stringify({ name: 'New Category', description: 'New Description' })
      })
    );
  });

  test('debe actualizar una categoría existente', async () => {
    const mockCategories = [
      { idCategory: 1, name: 'Category 1', description: 'Description 1' }
    ];
    
    // Mock fetch para la carga inicial
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories
    });

    // Mock fetch para actualizar una categoría
    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    // Mock fetch para recargar categorías después de actualizar
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ idCategory: 1, name: 'Updated Category', description: 'Updated Description' }]
    });

    await act(async () => {
      render(<CategoryContainer />);
    });

    // Esperar a que la carga termine y el spinner desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Asegurarse de que la lista de categorías esté renderizada
    await waitFor(() => {
      expect(screen.getByTestId('category-list')).toBeInTheDocument();
    });

    // Localizar y hacer clic en el botón de editar
    await waitFor(() => {
      expect(screen.getByTestId('edit-1')).toBeInTheDocument();
    });
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-1'));
    });

    // Localizar y hacer clic en el botón de actualizar en el modal
    await waitFor(() => {
      expect(screen.getByTestId('update-button')).toBeInTheDocument();
    });
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('update-button'));
    });

    // Verificar que se hizo la llamada API correcta
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api-namp/admin/category/1',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: JSON.stringify({ name: 'Updated Category', description: 'Updated Description' })
      })
    );
  });

  test('debe eliminar una categoría correctamente', async () => {
    const mockCategories = [
      { idCategory: 1, name: 'Category 1', description: 'Description 1' }
    ];
    
    // Mock fetch para la carga inicial
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories
    });

    // Mock fetch para eliminar una categoría
    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    // Mock fetch para recargar categorías después de eliminar
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Mock SweetAlert
    global.Swal = {
      fire: jest.fn().mockResolvedValue({ isConfirmed: true })
    };

    await act(async () => {
      render(<CategoryContainer />);
    });

    // Esperar a que la carga termine y el spinner desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Asegurarse de que la lista de categorías esté renderizada
    await waitFor(() => {
      expect(screen.getByTestId('category-list')).toBeInTheDocument();
    });

    // Localizar y hacer clic en el botón de eliminar
    await waitFor(() => {
      expect(screen.getByTestId('delete-1')).toBeInTheDocument();
    });
    
    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-1'));
    });

    // Verificar que se hizo la llamada API correcta
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api-namp/admin/category/1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake-token'
        })
      })
    );
  });

  test('debe filtrar categorías por nombre', async () => {
    const mockCategories = [
      { idCategory: 1, name: 'Category 1', description: 'Description 1' },
      { idCategory: 2, name: 'Category 2', description: 'Description 2' },
      { idCategory: 3, name: 'Different', description: 'Description 3' }
    ];
    
    // Mock fetch para la carga inicial
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories
    });

    await act(async () => {
      render(<CategoryContainer />);
    });

    // Esperar a que la carga termine y el spinner desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Buscar el campo de búsqueda con un selector más flexible
    const searchInput = await screen.findByRole('textbox');
    
    await act(async () => {
      fireEvent.change(searchInput, {
        target: { value: 'Category' }
      });
    });

    // Verificar que después del filtrado, solo las categorías con "Category" en el nombre deberían estar en la lista
    await waitFor(() => {
      expect(screen.getByTestId('category-1')).toBeInTheDocument();
      expect(screen.getByTestId('category-2')).toBeInTheDocument();
      expect(screen.queryByTestId('category-3')).not.toBeInTheDocument();
    });
  });

  test('debe mostrar error modal cuando la api falla', async () => {
    // Mock fetch para que falle
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Error al cargar categorías'
    });

    await act(async () => {
      render(<CategoryContainer />);
    });

    // Esperar a que aparezca el modal de error
    await waitFor(() => {
      expect(screen.getByTestId('error-modal')).toBeInTheDocument();
    });

    // Cerrar el modal de error
    await act(async () => {
      fireEvent.click(screen.getByTestId('close-error-button'));
    });

    // El modal de error debería estar cerrado
    expect(screen.queryByTestId('error-modal')).not.toBeInTheDocument();
  });
});