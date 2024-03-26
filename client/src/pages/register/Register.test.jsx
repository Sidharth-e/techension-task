import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

// Mocking the API service
jest.mock("../../service/apiService", () => ({
  userRegiser: jest.fn(() => Promise.resolve({ status: 200, data: { message: "Regisetered sucessfully" } }))
}));


describe("Register Component", () => {
  it("renders Register form correctly", () => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(getByText("Register", { selector: "h2" })).toBeInTheDocument(); // Specify it's an h2 element
    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByText("Already have an account?")).toBeInTheDocument();
  });

});
