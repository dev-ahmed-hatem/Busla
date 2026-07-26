import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSession } from "@/lib/auth/session";

const replaceMock = vi.fn();

// next-intl + locale-aware navigation are exercised elsewhere; here we stub them so the
// test focuses on the login form's behaviour (validation → BFF call → session → redirect).
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
  Link: ({ children, ...props }: { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import LoginPage from "./page";

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <LoginPage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  replaceMock.mockReset();
  useSession.getState().clear();
});

describe("LoginPage", () => {
  it("blocks submit and shows validation errors when fields are empty", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "login" }));

    expect(await screen.findByText("emailRequired")).toBeInTheDocument();
    expect(screen.getByText("passwordRequired")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("logs in, stores the session, and redirects to the dashboard", async () => {
    const user = {
      id: "1",
      email: "admin@busla.dev",
      full_name: "Ahmed Saeed",
      user_type: "ADMIN",
      locale: "en",
      phone: "",
      school: "s1",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access: "acc.token", user }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderPage();
    await userEvent.type(screen.getByLabelText("email"), "admin@busla.dev");
    await userEvent.type(screen.getByLabelText("password"), "busla1234");
    await userEvent.click(screen.getByRole("button", { name: "login" }));

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/dashboard"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" }),
    );
    expect(useSession.getState().accessToken).toBe("acc.token");
    expect(useSession.getState().user?.email).toBe("admin@busla.dev");
  });

  it("shows an error and does not redirect on invalid credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: "No active account" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    renderPage();
    await userEvent.type(screen.getByLabelText("email"), "admin@busla.dev");
    await userEvent.type(screen.getByLabelText("password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("invalidCredentials");
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
