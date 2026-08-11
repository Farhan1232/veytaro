import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "./ThemeToggle";
import { THEME_STORAGE_KEY } from "../lib/theme";
import { content } from "../content";

describe("<ThemeToggle>", () => {
  it("renders dark on a first visit", () => {
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("offers the light theme while dark is active", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: content.theme.toLight })).toBeTruthy();
  });

  it("switches the document theme on click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: content.theme.toLight }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await user.click(screen.getByRole("button", { name: content.theme.toDark }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("persists the choice so it survives a reload", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: content.theme.toLight }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("restores a stored preference on mount", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(<ThemeToggle />);

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    // The button now offers the other direction.
    expect(screen.getByRole("button", { name: content.theme.toDark })).toBeTruthy();
  });

  it("labels itself for screen readers rather than relying on the icon", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toBe(content.theme.toLight);
  });
});
