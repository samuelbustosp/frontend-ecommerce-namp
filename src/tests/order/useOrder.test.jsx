import { renderHook, act } from "@testing-library/react";
import useOrder from "../../hooks/order/useOrder";

// Hacer los mocks primero
jest.mock("../contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../hooks/user/useFetchUserById", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Luego importar los hooks ya mockeados
import { useUser } from "../../contexts/UserContext";
import useFetchUserById from "../../hooks/user/useFetchUserById";

global.fetch = jest.fn();

describe("useOrder", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería crear una orden correctamente", async () => {
    useUser.mockReturnValue({
      user: { username: "testUser" },
      token: "mockedToken",
    });

    useFetchUserById.mockReturnValue({
      idUser: 123,
      error: null,
    });

    const mockedResponse = { idOrder: 1, status: "CREATED" };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => mockedResponse,
      headers: {
        get: () => "application/json",
      },
    });

    const { result } = renderHook(() => useOrder());

    let orderData;
    await act(async () => {
      orderData = await result.current.createOrder();
    });

    expect(orderData).toEqual(mockedResponse);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("debería manejar error si no hay token", async () => {
    useUser.mockReturnValue({
      user: { username: "testUser" },
      token: null,
    });

    useFetchUserById.mockReturnValue({
      idUser: null,
      error: null,
    });

    const { result } = renderHook(() => useOrder());

    await act(async () => {
      await result.current.createOrder();
    });

    expect(result.current.error).toBe("No se ha encontrado el token de autenticación.");
    expect(fetch).not.toHaveBeenCalled();
  });
});

