import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OpportunityCard } from "@/components/opportunity-card";
import type { Opportunity } from "@/lib/types";

// next/link renders a plain anchor in the test environment.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const opp: Opportunity = {
  id: 42,
  type: "automation",
  title: "Automate Cost Reporting",
  desc: "Build a Slack digest for namespace spend.",
  longDesc: "",
  skills: ["Go", "Kubernetes"],
  match: 88,
  days: 12,
  team: "2 / 5",
  proposals: 4,
  ownerName: "Ananya Rao",
  ownerDept: "Platform",
  ownerInitials: "AR",
  rewardBig: "₹40,000",
  rewardLabel: "automation bonus",
  matchPct: "88% fit",
  rewardChips: [],
  roles: [],
};

describe("OpportunityCard", () => {
  it("renders the title, reward and skills", () => {
    render(<OpportunityCard o={opp} />);
    expect(screen.getByText("Automate Cost Reporting")).toBeInTheDocument();
    expect(screen.getByText("₹40,000")).toBeInTheDocument();
    expect(screen.getByText("Go")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
  });

  it("links to the opportunity detail page", () => {
    render(<OpportunityCard o={opp} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/explore/42");
  });

  it("shows the match percentage and proposal count", () => {
    render(<OpportunityCard o={opp} />);
    expect(screen.getByText("88% match")).toBeInTheDocument();
    expect(screen.getByText("4 proposals")).toBeInTheDocument();
  });

  it("uses the human label for the opportunity type", () => {
    render(<OpportunityCard o={opp} />);
    expect(screen.getByText("Automation")).toBeInTheDocument();
  });
});
