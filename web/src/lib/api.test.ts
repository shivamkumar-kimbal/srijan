import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, setAccessToken } from "@/lib/api";
import type { Opportunity, OppInput, ProposalInput } from "@/lib/types";

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  });
}

describe("api client", () => {
  beforeEach(() => {
    setAccessToken(undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("GET opportunities hits the list endpoint", async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal("fetch", fetchMock);

    await api.opportunities();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/opportunities",
      expect.objectContaining({ headers: expect.objectContaining({ "Content-Type": "application/json" }) }),
    );
  });

  it("GET opportunities appends a type query when filtered", async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal("fetch", fetchMock);

    await api.opportunities("automation");
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/opportunities?type=automation");
  });

  it('GET opportunities ignores the "all" pseudo-filter', async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal("fetch", fetchMock);

    await api.opportunities("all");
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/opportunities");
  });

  it("GET single opportunity returns the parsed body", async () => {
    const opp = { id: 7, title: "X" } as Opportunity;
    vi.stubGlobal("fetch", mockFetch(200, opp));

    const got = await api.opportunity(7);
    expect(got).toEqual(opp);
  });

  it("POST createOpportunity sends a JSON body", async () => {
    const fetchMock = mockFetch(201, { id: 1 });
    vi.stubGlobal("fetch", fetchMock);

    const input = { type: "innovation", title: "New" } as OppInput;
    await api.createOpportunity(input);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toMatchObject({ type: "innovation", title: "New" });
  });

  it("POST submitProposal targets the proposals endpoint", async () => {
    const fetchMock = mockFetch(201, {});
    vi.stubGlobal("fetch", fetchMock);

    const body = { why: "keen", experience: "lots", weeklyHours: 6 } as ProposalInput;
    await api.submitProposal(3, body);

    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/opportunities/3/proposals");
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  it("GET proposals hits the list endpoint without a filter", async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal("fetch", fetchMock);

    await api.proposals();
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/proposals");
  });

  it("GET proposals encodes the author filter", async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal("fetch", fetchMock);

    await api.proposals("Shivam Kumar");
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/proposals?author=Shivam%20Kumar");
  });

  it("attaches the bearer token when an access token is set", async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal("fetch", fetchMock);

    setAccessToken("abc123");
    await api.profile();

    expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ Authorization: "Bearer abc123" });
  });

  it("omits the Authorization header when no token is set", async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal("fetch", fetchMock);

    await api.insights();
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty("Authorization");
  });

  it("throws with status + body on a non-ok response", async () => {
    vi.stubGlobal("fetch", mockFetch(500, "boom"));
    await expect(api.board()).rejects.toThrow("API 500: boom");
  });
});
