import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// Mocking the API service
jest.mock("../../service/apiService", () => ({
  userLogin: jest.fn(() => Promise.resolve({ status: 200, data: { message: "Invalid credentials" } }))
}));


describe("Login Component", () => {
  it("renders login form correctly", () => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(getByText("Login", { selector: "h2" })).toBeInTheDocument(); // Specify it's an h2 element
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByText("Don't have an account?")).toBeInTheDocument();
  });

});
