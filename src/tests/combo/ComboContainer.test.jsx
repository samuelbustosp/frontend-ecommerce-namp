import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComboContainer from '../../containers/admin/combo/ComboContainer';
import { useUser } from '../../contexts/UserContext';
import { act } from 'react';

// Mock the entire UserContext
jest.mock('../../contexts/UserContext', () => ({
  useUser: jest.fn()
}));

// Mock fetch API
global.fetch = jest.fn();

// Mock the child components
jest.mock('../../components/admin/combo/ComboList', () => {
  return function MockComboList({ combos, deleteCombo, onEditCombo }) {
    return (
      <div data-testid="combo-list">
        {combos.map(combo => (
          <div key={combo.id} data-testid={`combo-${combo.id}`}>
            {combo.name}
            <button onClick={() => deleteCombo(combo.id)} data-testid={`delete-${combo.id}`}>
              Delete
            </button>
            <button onClick={() => onEditCombo(combo)} data-testid={`edit-${combo.id}`}>
              Edit
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/admin/combo/ComboModal', () => {
  return function MockAddComboModal({ isOpen, onClose, onAddCombo, onUpdateCombo, comboToEdit }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid="add-combo-modal">
        <input 
          data-testid="name-input" 
          defaultValue={comboToEdit ? comboToEdit.name : ''} 
        />
        <input 
          data-testid="price-input" 
          defaultValue={comboToEdit ? comboToEdit.price : ''} 
        />
        <button 
          onClick={() => onAddCombo({ name: 'New Combo', price: '2500' })}
          data-testid="add-button"
        >
          Add
        </button>
        <button 
          onClick={() => onUpdateCombo(comboToEdit?.id, { name: 'Updated Combo', price: '3000' })}
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

describe('ComboContainer', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ token: 'fake-token' });
    jest.clearAllMocks();
  });

  test('debe cargar y mostrar combos correctamente', async () => {
    const mockCombos = [
      { id: 1, name: 'Combo Fiesta', price: 1000 },
      { id: 2, name: 'Combo Parrillero', price: 1500 }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCombos
    });

    await act(async () => {
      render(<ComboContainer />);
    });

    // Esperar a que la carga termine
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api-namp/combo',
        expect.objectContaining({ method: 'GET' })
      );      
    });

    // Esperar a que el spinner de carga desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Verificar que los combos estén en pantalla
    expect(screen.getByText('Combo Fiesta')).toBeInTheDocument();
    expect(screen.getByText('Combo Parrillero')).toBeInTheDocument();
  });


  test('debe actualizar un combo existente', async () => {
    const mockCombos = [
      { id: 1, name: 'Combo Fiesta', price: 1000 }
    ];
  
    // Mock fetch para la carga inicial
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCombos
    });
  
    // Mock fetch para update PUT
    global.fetch.mockResolvedValueOnce({ ok: true });
  
    // Mock fetch para recarga de combos después del update
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: 'Updated Combo', price: 3000 }]
    });
  
    await act(async () => {
      render(<ComboContainer />);
    });
  
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  
    await waitFor(() => {
      expect(screen.getByTestId('edit-1')).toBeInTheDocument();
    });
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-1'));
    });
  
    await waitFor(() => {
      expect(screen.getByTestId('update-button')).toBeInTheDocument();
    });
  
    await act(async () => {
      fireEvent.click(screen.getByTestId('update-button'));
    });
  
    const putCall = global.fetch.mock.calls.find(
      ([url]) => url === 'http://localhost:8080/api-namp/admin/combo/1'
    );
  
    expect(putCall).toBeTruthy();
    const [, options] = putCall;
  
    expect(options.method).toBe('PUT');
    expect(options.headers.Authorization).toBe('Bearer fake-token');
    expect(options.body).toBeInstanceOf(FormData);
  
    const formDataEntries = Array.from(options.body.entries());
    expect(formDataEntries).toContainEqual(['combo', JSON.stringify({ name: 'Updated Combo', price: '3000' })]);

  });
  
  
  test('debe eliminar un combo correctamente', async () => {
    const mockCombos = [
      { id: 1, name: 'Combo Fiesta', price: 1000 }
    ];

    // Mock fetch para la carga inicial
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCombos
    });

    // Mock fetch para eliminar un combo
    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    // Mock fetch para recargar combos después de eliminar
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Mock SweetAlert
    global.Swal = {
      fire: jest.fn().mockResolvedValue({ isConfirmed: true })
    };

    await act(async () => {
      render(<ComboContainer />);
    });

    // Esperar a que la carga termine y el spinner desaparezca
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Asegurarse de que la lista de combos esté renderizada
    await waitFor(() => {
      expect(screen.getByTestId('combo-list')).toBeInTheDocument();
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
      'http://localhost:8080/api-namp/admin/combo/1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake-token'
        })
      })
    );
  });
});
