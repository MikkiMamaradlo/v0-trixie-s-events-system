import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../../../components/ui/button";

// Mock the cn utility function
jest.mock("../../../lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

describe("Button Component", () => {
  describe("Basic Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2",
        "whitespace-nowrap",
        "rounded-md",
        "text-sm",
        "font-medium",
        "transition-all",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "h-9",
        "px-4",
        "py-2",
        "bg-primary",
        "text-primary-foreground",
        "hover:bg-primary/90"
      );
    });

    it("renders children correctly", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Button className="custom-class">Click me</Button>);

      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<Button variant="default">Default</Button>);

      const button = screen.getByRole("button", { name: /default/i });
      expect(button).toHaveClass(
        "bg-primary",
        "text-primary-foreground",
        "hover:bg-primary/90"
      );
    });

    it("renders destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole("button", { name: /delete/i });
      expect(button).toHaveClass(
        "bg-destructive",
        "text-white",
        "hover:bg-destructive/90",
        "focus-visible:ring-destructive/20"
      );
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button", { name: /outline/i });
      expect(button).toHaveClass(
        "border",
        "bg-background",
        "shadow-xs",
        "hover:bg-accent",
        "hover:text-accent-foreground"
      );
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button", { name: /secondary/i });
      expect(button).toHaveClass(
        "bg-secondary",
        "text-secondary-foreground",
        "hover:bg-secondary/80"
      );
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button", { name: /ghost/i });
      expect(button).toHaveClass(
        "hover:bg-accent",
        "hover:text-accent-foreground"
      );
    });

    it("renders link variant", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByRole("button", { name: /link/i });
      expect(button).toHaveClass(
        "text-primary",
        "underline-offset-4",
        "hover:underline"
      );
    });
  });

  describe("Sizes", () => {
    it("renders default size", () => {
      render(<Button size="default">Default</Button>);

      const button = screen.getByRole("button", { name: /default/i });
      expect(button).toHaveClass("h-9", "px-4", "py-2");
    });

    it("renders small size", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button", { name: /small/i });
      expect(button).toHaveClass("h-8", "rounded-md", "gap-1.5", "px-3");
    });

    it("renders large size", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button", { name: /large/i });
      expect(button).toHaveClass("h-10", "rounded-md", "px-6");
    });

    it("renders icon size", () => {
      render(<Button size="icon">Icon</Button>);

      const button = screen.getByRole("button", { name: /icon/i });
      expect(button).toHaveClass("size-9");
    });

    it("renders icon-sm size", () => {
      render(<Button size="icon-sm">Icon SM</Button>);

      const button = screen.getByRole("button", { name: /icon sm/i });
      expect(button).toHaveClass("size-8");
    });

    it("renders icon-lg size", () => {
      render(<Button size="icon-lg">Icon LG</Button>);

      const button = screen.getByRole("button", { name: /icon lg/i });
      expect(button).toHaveClass("size-10");
    });
  });

  describe("States", () => {
    it("handles disabled state", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button", { name: /disabled/i });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "disabled:pointer-events-none",
        "disabled:opacity-50"
      );
    });

    it("handles loading state with aria-busy", () => {
      render(<Button aria-busy="true">Loading</Button>);

      const button = screen.getByRole("button", { name: /loading/i });
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });

  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<Button>Button</Button>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-invalid", () => {
      render(<Button aria-invalid="true">Invalid</Button>);

      const button = screen.getByRole("button", { name: /invalid/i });
      expect(button).toHaveAttribute("aria-invalid", "true");
      expect(button).toHaveClass("aria-invalid:ring-destructive/20");
    });

    it("supports focus-visible styles", () => {
      render(<Button>Focus</Button>);

      const button = screen.getByRole("button", { name: /focus/i });
      expect(button).toHaveClass(
        "outline-none",
        "focus-visible:border-ring",
        "focus-visible:ring-ring/50",
        "focus-visible:ring-[3px]"
      );
    });
  });

  describe("SVG Icons", () => {
    it("handles SVG icons with default size", () => {
      render(
        <Button>
          <svg data-testid="icon" />
          With Icon
        </Button>
      );

      const button = screen.getByRole("button", { name: /with icon/i });
      const icon = screen.getByTestId("icon");

      expect(button).toHaveClass(
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg]:shrink-0"
      );
      expect(icon).toBeInTheDocument();
    });

    it("handles SVG icons with size classes", () => {
      render(
        <Button>
          <svg className="size-6" data-testid="icon" />
          With Icon
        </Button>
      );

      const button = screen.getByRole("button", { name: /with icon/i });
      expect(button).toHaveClass("[&_svg]:pointer-events-none");
    });

    it("adjusts padding when SVG is present", () => {
      render(
        <Button>
          <svg data-testid="icon" />
          Icon Button
        </Button>
      );

      const button = screen.getByRole("button", { name: /icon button/i });
      expect(button).toHaveClass("has-[>svg]:px-3");
    });
  });

  describe("asChild Prop", () => {
    it("renders as Slot when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link</a>
        </Button>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("data-slot", "button");
      expect(link).toHaveClass("inline-flex");
    });

    it("renders as button when asChild is false", () => {
      render(<Button asChild={false}>Button Content</Button>);

      const button = screen.getByRole("button", { name: /button content/i });
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("Event Handling", () => {
    it("handles click events", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button", { name: /click me/i });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("prevents click when disabled", () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button", { name: /disabled/i });
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Data Attributes", () => {
    it("has correct data-slot attribute", () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-slot", "button");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children", () => {
      render(<Button />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it("handles complex children", () => {
      render(
        <Button>
          <span>Complex</span>
          <strong>Content</strong>
        </Button>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("handles multiple className props", () => {
      render(<Button className="class1 class2">Multiple</Button>);

      const button = screen.getByRole("button", { name: /multiple/i });
      expect(button).toHaveClass("class1", "class2");
    });
  });
});
