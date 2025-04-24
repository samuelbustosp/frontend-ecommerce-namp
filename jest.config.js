module.exports = {
    // 1️⃣ Simula un DOM para React Testing Library
    testEnvironment: "jsdom",
  
    // 2️⃣ Carga jest-dom antes de cada test
    setupFilesAfterEnv: [
      "@testing-library/jest-dom"
    ],
  
    // 3️⃣ Usa babel-jest para transformar JSX/ESM
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest"
    },
  
    // 4️⃣ Extensiones que Jest resolverá
    moduleFileExtensions: ["js", "jsx", "json", "node"],
  };
  