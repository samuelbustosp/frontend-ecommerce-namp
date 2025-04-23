import { renderHook, act } from '@testing-library/react';
import useCart from '../../hooks/cart/useCart';
import { useUser } from '../../contexts/UserContext';

jest.mock('../../contexts/UserContext');

describe('useCart', () => {
    beforeEach(() => {
        useUser.mockReturnValue({ user: { username: 'samuel' } });
        localStorage.clear();
    });

    test('inicia con carrito vacío si no hay nada en localStorage', () => {
        const { result } = renderHook(() => useCart());
        expect(result.current.cart).toEqual([]);
        expect(result.current.total).toBe(0);
    });

    test('agrega un item al carrito y calcula el total', () => { 
        const {result} = renderHook(()=>useCart());

        const item = { id: 1, type: 'product', price: 1000 };

        act(() => {
            result.current.addItem(item, 2);
        });

        expect(result.current.cart[0].quantity).toBe(2);
        expect(result.current.total).toBe(item.price * result.current.cart[0].quantity);

    });

    test('acumula cantidades si el item ya existe', () => {
        const {result} = renderHook(()=>useCart());

        const item = { id: 1, type: 'product', price: 1000 };

        act(()=>{
            result.current.addItem(item,1);
            result.current.addItem(item,3);
        });

        expect(result.current.cart[0].quantity).toBe(4);
        expect(result.current.total).toBe(result.current.cart[0].quantity*item.price);
    });

    test('elimina un item del carrito', () => { 
        const {result} = renderHook(()=>useCart());

        const item = { id: 1, type: 'product', price: 1000 };

        act(()=>{
            result.current.addItem(item,3);
        });

        act(()=>{
            result.current.removeItem(item.id);
        });

        expect(result.current.cart).toHaveLength(0);
        expect(result.current.total).toBe(0);

    });

    test('limpiar carrito', () => { 
        const {result} = renderHook(()=>useCart());

        const item = { id: 1, type: 'product', price: 1000 };

        act(()=>{
            result.current.addItem(item,2);
        })

        expect(result.current.cart).toHaveLength(1);

        act(()=>{
            result.current.clearCart();
        })

        expect(result.current.cart).toEqual([]);
        expect(JSON.parse(localStorage.getItem('cart-samuel'))).toEqual([]);
     });

});
