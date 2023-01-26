import { render, screen } from "@testing-library/react";
import App from "./App";
import data from "./data.json";

describe("start wars app", () => {
  beforeAll(() => jest.spyOn(window, "fetch"));

  it("should a list of character from the api", async () => {
    window.fetch.mockResolvedValueOnce({ ok: true, json: async () => data });
  });
  render(<App />);
  expect(window.fetch).toHaveBeenCalledTImes(1);
  expect(window.fetch).toHaveBeenCalledWith("http://swapi.dev/api/people/");
  for (let character of data.results) {
    expect(screen.getByText(character.name)).toBeInTheDocument();
  }

  it("should show an error message when has a network erroe", async () => {
    window.fetch.mockResolvedValueOnce(new Error("Network error"));
    render(<App />);
    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
